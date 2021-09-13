import { Injectable, Res } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateRestaurantDto } from "./dtos/create-restaurant.dto";
import { UpdateRestaurantDto } from "./dtos/update-restaurant.dto";
import { Restaurant } from "./entities/restaurant.entity";

@Injectable()
export class RestaurantService{
    constructor(
        @InjectRepository(Restaurant)
        private readonly restaurants: Repository<Restaurant>
    ){}
    getAll(): Promise<Restaurant[]>
    {
        return this.restaurants.find();
    }
    createRestaurant(createRestaurantDto: CreateRestaurantDto){
        const newRestaurant = this.restaurants.create(createRestaurantDto);// 객체를 new해서 단지 쉽게 만들어준ㄷ
        return this.restaurants.save(newRestaurant); 
    }

    // {id, data} -> 이렇게 쪼개서 받을 수도 있다.
    updateRestaurant({id, data} : UpdateRestaurantDto){
        return this.restaurants.update(id, {...data});// update 하고 싶은 object, 
    }

}