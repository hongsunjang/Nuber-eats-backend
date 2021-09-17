import { Field, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity } from "typeorm";
import * as bcrypt from 'bcrypt'
import { InternalServerErrorException } from "@nestjs/common";

enum UserRole{
    Client,
    Owner,
    Delivery,
}
registerEnumType(UserRole, {name: 'UserRole'}) // Ennum name을 넣으면 

@InputType({isAbstract : true})
@ObjectType()
@Entity()
export class User extends CoreEntity{
    @Column()
    @Field(type=>String)
    email:string;
    
    @Column({select: false}) // select로 명시해야 가져올 수있다. -> 이때 select로 명시한 col만 가져오는것에 주의!
    @Field(type=>String)
    password:string;

    @Column({type: 'enum', enum: UserRole})
    @Field(type=>UserRole)
    role: UserRole;
    
    @Column({default: false})
    @Field(type=> Boolean)
    verified: boolean;    

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword(): Promise<void>{
        if(this.password){
            try{
                this.password =  await bcrypt.hash(this.password, 10) //saltOrRound 반복 횟수
            } catch(e){
                console.log(e)
                throw new InternalServerErrorException();
            }
        }
      }

    async checkPassword(aPassword: string):Promise<boolean>{
        try{
            const ok = await bcrypt.compare(aPassword, this.password);
            return ok;
        } catch(e){
            console.log(e);
            throw new InternalServerErrorException();
        }
    }
}