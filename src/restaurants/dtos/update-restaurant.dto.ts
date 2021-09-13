import { ArgsType, Field, InputType, PartialType } from "@nestjs/graphql";
import { CreateRestaurantDto } from "./create-restaurant.dto";




@InputType() //-> these allows to separte value to Graphqli, create 
export class UpdateRestaurantInputType extends PartialType(CreateRestaurantDto,) { }

@ArgsType()
export class UpdateRestaurantDto{
    @Field(type => Number)
    id: number;

    @Field(type => UpdateRestaurantInputType)
    data: UpdateRestaurantInputType
}