import { UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthUser } from "src/auth/auth-user.decorator";
import { AuthGuard } from "src/auth/auth.guard";
import { CreateAccountInput, CreateAccountOutput } from "./dtos/create-account.dto";
import { LoginInput, LoginOutput } from "./dtos/login.dto";
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
}