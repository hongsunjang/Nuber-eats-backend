import { UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthUser } from "src/auth/auth-user.decorator";
import { AuthGuard } from "src/auth/auth.guard";
import { CreateAccountInput, CreateAccountOutput } from "./dtos/create-account.dto";
import { EditProfileInput, EditProfileOutput } from "./dtos/edit-profile.dto";
import { LoginInput, LoginOutput } from "./dtos/login.dto";
import { UserProfileInput, UserProfileOutput } from "./dtos/user-profile.dto";
import { VerifyEmailInput, VerifyEmailOutput } from "./dtos/verify-email.dto";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";



@Resolver(of => User)
export class UsersResolver{
    constructor(private readonly usersService: UsersService){}
    
    @Mutation(returns => CreateAccountOutput)
    async createAccount(@Args("input") createAccountInput:CreateAccountInput){
        try{
            const {ok, error} = await this.usersService.createAccount(createAccountInput);
            if (error){
                return{
                    ok,
                    error,
                }
            }
            return{
                ok,
            }
        } catch(error){
            return{
                ok: false,
                error,
            }
        }
        return{
            ok: true,
            token: "TOKEN"
        }
    }

    @Mutation(returns => LoginOutput)
    async login(@Args("input") loginInput: LoginInput): Promise<LoginOutput>{
        try{
            const {ok, error, token} = await this.usersService.login(loginInput);
            return {ok, error, token}
        }catch(e){
            return{
                ok: false
            } 
        }
    }

    @Query(returns=>User)
    @UseGuards(AuthGuard)
    me(@AuthUser() authUser: User){
        console.log(authUser)
        return authUser
    }

    @Query(returns=> UserProfileOutput)
    @UseGuards(AuthGuard)
    async userProfile(@Args() userProfileInput: UserProfileInput
    ): Promise<UserProfileOutput> {
        try{
            const user = this.usersService.findById(userProfileInput.userId);
            if (!user){
                throw Error();
            } 
            console.log(user)
            return user;

        }catch(e){
            return{
                error: 'User Not Found',
                ok: false, 
            }
        }
    }

    @Mutation(returns => EditProfileOutput)
    @UseGuards(AuthGuard)
    async editProfile(@AuthUser() authUser:User, @Args('input') editProfileInput:EditProfileInput){
        try{
            console.log(EditProfileInput)
            console.log(authUser)
            await this.usersService.editProfile(authUser.id, editProfileInput);
            return{
                ok: true,
            } 
        }catch(error){
            return{
                ok: false,
                error
            }
        }
    }

    @Mutation(returns=> VerifyEmailOutput)
    async verifyEmail(@Args('input') {code}: VerifyEmailInput):Promise<VerifyEmailOutput>{
        return this.usersService.verifyEmail(code); 
    }
}