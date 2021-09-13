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

@Injectable()
export class UsersService{
    constructor(
        @InjectRepository(User) private readonly users: Repository<User>,
        private readonly config: ConfigService,
    ){}
    

    async createAccount({email, password, role}: CreateAccountInput): Promise<{ok:boolean,error?: string}>{
        try{
            const exists = await this.users.findOne({email});
            if(exists){
                // make error 
                return {ok:false, error: "There is a user that email already"}
            }
            await this.users.save(this.users.create({email, password, role}));
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
            const user = await this.users.findOne({email});
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

    async findById(id:number): Promise<User>{
        return this.users.findOne({id});
    }
}