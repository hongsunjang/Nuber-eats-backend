import { ArgsType, Field, InputType, OmitType } from "@nestjs/graphql";
import { IsString, Length, IsBoolean } from "class-validator";
import { Restaurant } from "../entities/restaurant.entity";

//@InputType() -> one object passing
@InputType() //-> these allows to separte value to Graphqli, create 
export class CreateRestaurantDto extends OmitType(Restaurant, ['id'], InputType) { } //entity에서 id를 제외한 모든 걸 받고싶다.