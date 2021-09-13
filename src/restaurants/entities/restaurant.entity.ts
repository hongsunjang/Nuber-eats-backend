import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { EnumDefinitionFactory } from "@nestjs/graphql/dist/schema-builder/factories/enum-definition.factory";
import { IsOptional, IsString, Length } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


//Object tpye ->
@InputType({isAbstract:true}) // Input Type이 스키마에 포함되지 않았으면좋겠다 -> 단지 어딘선가 복사해서 쓴다는걸 명시
@ObjectType()
@Entity()
export class Restaurant {
   @PrimaryGeneratedColumn()
   @Field(type=> Number)
   id: number;

   @Field(is => String)
   @Column()
   @IsString()
   @Length(5,10)
   name: string;

   @Field(type => Boolean, {nullable: true}) 
   @Column()
   @IsOptional()
   isVegan?: boolean;

   @Field(type => String, {nullable: true, defaultValue: "Seoul"})
   @Column()
   @IsString()
   address: string;

   @Field(type => String)
   @Column()  
   @IsString()
   ownersName : string;

   @Field(type=> String)
   @Column()
   @IsString()
   catagoryName: string;
}