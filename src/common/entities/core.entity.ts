import { Field, ObjectType } from "@nestjs/graphql";
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@ObjectType()
export class CoreEntity{
    @PrimaryGeneratedColumn()
    @Field(type=>Number)
    id: number;
    @CreateDateColumn() // Create 되었을 때 자동으로 설정해줌
    @Field(type=>Date) 
    createAt: Date;

    @UpdateDateColumn()
    @Field(type=>Date)
    updateAt: Date;
}