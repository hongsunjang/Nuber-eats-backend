import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { UsersService } from "src/users/users.service";
import { JwtService } from "./jwt.service";

/*
export function JwtMiddleware(req:Request, res: Response, next: NextFunction){
    //users repository를 가져올거라 class로 사용하자 
    console.log(req.headers)
    next()
}
*/
@Injectable()// dependency injection하기가 힘들기떄문에 추가했다.
export class JwtMiddleware implements NestMiddleware{
    constructor(
        private readonly jwtService: JwtService, //Module에서 export로 지정해줬기 떄문에 찾을수있다.
        private readonly usersService: UsersService,
        ){}
    //implement는 class가 interface처럼 행동한다는 뜻
    async use(req:Request, res: Response, next: NextFunction){
        if ("x-jwt" in req.headers){
            const token = req.headers["x-jwt"]
            try {
                const decoded = this.jwtService.verify(token.toString());
                if(typeof(decoded) == "object" && decoded.hasOwnProperty('id')){
                    const user = await this.usersService.findById(decoded['id'])
                    req['user'] = user 
                }
            }catch(e){}
        }
        next()
    }
}