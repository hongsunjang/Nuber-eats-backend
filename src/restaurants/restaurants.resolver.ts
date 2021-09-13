import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CreateRestaurantDto } from "./dtos/create-restaurant.dto";
import { UpdateRestaurantDto, UpdateRestaurantInputType } from "./dtos/update-restaurant.dto";
import { Restaurant } from "./entities/restaurant.entity";
import { RestaurantService } from "./restaurants.service";


@Resolver(of => Restaurant)
export class RestaurantResolver {
    constructor(private readonly restaurantService: RestaurantService){}
    @Query( returns => [Restaurant])//Query retrun type -> GrpahQL에서는 이렇게 array를 표현한다.
    restaurants(): Promise<Restaurant[]>{ // function return type -> typescript에서는 이렇게 array 포현
        return this.restaurantService.getAll();
    }     
    @Mutation(returns => Boolean)
    async createRestaurant( // async로 꼭 해줘야한다.
        @Args('input') createRestaurantInput : CreateRestaurantDto
    ): Promise<boolean>{
        try{
            await this.restaurantService.createRestaurant(createRestaurantInput);
            return true
        }catch(e){
            console.log(e);
            return false;
        }
    }
    @Mutation(returns => Boolean)
    async updateRestaurant(
        @Args() UpdateRestaurantDto: UpdateRestaurantDto,
    ): Promise<boolean>{
        try{
            await this.restaurantService.updateRestaurant(UpdateRestaurantDto)
            return true
        } catch(e){
            return false
        }
    }

}