import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { KnownArgumentNamesOnDirectivesRule } from "graphql/validation/rules/KnownArgumentNamesRule";
import { Repository } from "typeorm";
import { CreateAccountInput } from "./dtos/create-account.dto";
import { LoginInput } from "./dtos/login.dto";
import { User } from "./entities/user.entity";
import * as jwt from "jsonwebtoken";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "src/jwt/jwt.service";
import { UserProfileOutput } from "./dtos/user-profile.dto";
import { EditProfileInput, EditProfileOutput } from "./dtos/edit-profile.dto";
import { Verification } from "./entities/verification.entity";
import { VerifyEmailOutput } from "./dtos/verify-email.dto";

@Injectable()
export class UsersService{
    constructor(
        @InjectRepository(User) private readonly users: Repository<User>,
        @InjectRepository(Verification) private readonly verifications: Repository<Verification>,
        private readonly config: ConfigService,
    ){}
    

    async createAccount({email, password, role}: CreateAccountInput): Promise<{ok:boolean,error?: string}>{
        try{
            const exists = await this.users.findOne({email});
            if(exists){
                // make error 
                return {ok:false, error: "There is a user that email already"}
            }
            const user = await this.users.save(this.users.create({email, password, role}));
            await this.verifications.save(this.verifications.create({
                user,
            }));

            return {ok: true};
        }catch(e){
            return {ok: false, error: "Couldn't create account"}
        }
        // check new user

        // create user & hash the password

        // ok

    }

    async login({email, password}: LoginInput):Promise<{ok: boolean; error?: string; token?:string}>{
        try{
            const user = await this.users.findOne({email},{select:['password','id']});
            if (!user){
                return {
                    ok: false,
                    error: "User not found!"
                }
            }
            const passwordCorrect = await user.checkPassword(password); 
            if (!passwordCorrect) {
                return{
                    ok: false,
                    error: "Wrong password!"
                }
            }
            const token = jwt.sign({id: user.id}, this.config.get('SECRET_KEY'));         
            return{
                ok: true,
                token: token,
            }
        }catch(e){
            return{
                ok: false,
                error: e 
            }
        }
    }

    async findById(id:number): Promise<UserProfileOutput>{
        try{
            const user = await this.users.findOneOrFail({id});
            return{
                ok: true,
                user,
            };
        } catch(error){
            return {ok: false, error: 'User Not Found'};
        }
    }

    async editProfile(userId:number, {email, password}: EditProfileInput):Promise<User>{ //{email, password}이런형태를 쓰면 안된다.
        console.log(userId)
        const user = await this.users.findOne(userId);
        if(email){
            user.email = email;
            user.verified = false;
            await this.verifications.save(this.verifications.create({user}));
        }
        if(password){
            user.password = password;
        }
        return this.users.save(user);

        //string, number, number[] 다 보낼 수 있다.
        // entity가 이미 있는지 아닌지 확인없이 query만 보내는게 update이다.
    }

    async verifyEmail(code: string): Promise<VerifyEmailOutput>{
        try{
            const verification = await this.verifications.findOne({code}, {relations: ['user']});
            if (verification) {
                verification.user.verified= true
                this.users.save(verification.user);
                return {
                    ok: true,
                }
            }
            return{
                ok: false,
                error: "No verification!"
            }
        } catch(error){
            return {
                ok: false,
                error: error
            }
        }
    }
}