import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { User } from "./user.entity";
import {v4 as uuidv4} from "uuid";



@InputType()
@ObjectType()
@Entity()
export class Verification extends CoreEntity{
    @Column()
    @Field(type =>String)
    code: string;

    //OneToOne 과
    //Join Column ->
    @OneToOne(type => User,{onDelete:"CASCADE"}) // Delete시 동작을 명시할 수 있다.
    @JoinColumn()
    user: User;

    @BeforeInsert()
    createCode():void{
        //Math.random.().toString(36).substr() -> java script에서 편하게 만들 수 있는 
        this.code = uuidv4();
    }
}