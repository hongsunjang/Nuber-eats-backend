import { Inject, Injectable } from '@nestjs/common';
import { JwtModuleOptions } from './jwt.interfaces';
import { CONFIG_OPTIONS } from './jwt.constants';
import * as jwt from "jsonwebtoken";
export class JwtService {
    constructor(@Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions){
            console.log(options);
        } // Module에서 무언가를 service로 inject
    sign(payload:object): string{
        return jwt.sign(payload, this.options.privateKey)
    }
    verify(token:string){
        return jwt.verify(token, this.options.privateKey)
    }
}
