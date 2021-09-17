import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";


@Injectable()
export class AuthGuard implements CanActivate{
        //request 의 context에 접근할 수 있다. (http방식) -> GraphQL context로 바꿔주야한다.
        canActivate(context:ExecutionContext){
            const gqlContext = GqlExecutionContext.create(context).getContext();
            console.log(gqlContext)
            const user = gqlContext['user']['user'];
            console.log("guard user:")
            console.log(user)
            if (!user){
                return false
            }else{
                return true
            }
        }
}