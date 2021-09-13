import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantsModule } from './restaurants/restaurants.module';
import * as Joi from 'joi'
import { Restaurant } from './restaurants/entities/restaurant.entity';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { User } from './users/entities/user.entity';
import { JwtModule } from './jwt/jwt.module';
import { MiddlewareBuilder } from '@nestjs/core';
import { JwtMiddleware } from './jwt/jwt.middleware';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: process.env.NODE_ENV === "dev" ? ".env.dev": ".env.test",
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev','prod').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT:  Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD:  Joi.string().required(),
        DB_NAME:  Joi.string().required(),
        SECRET_KEY: Joi.string().required(),
      })
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,//localhost에서는 비밀 번호 확인 X
      database: process.env.DB_NAME,
      synchronize: process.env.NODE_ENV !== 'prod',
      logging: true,
      entities: [Restaurant, User],  
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      context:({req}) => ({user: req['user']}), // request user를 context와 공유한다 ->모든 graphQl resolver와
    }), 
    RestaurantsModule, UsersModule,
    JwtModule.forRoot({
      privateKey: process.env.SECRET_KEY,
    }), 
  ],
  controllers: [],
  providers: [],
})

export class AppModule implements NestModule{
  //NextModlue은 configure 함수가 필요하다.
  configure(consumer:MiddlewareConsumer){
    consumer.apply(JwtMiddleware).forRoutes({
      path:"/graphql",
      method: RequestMethod.ALL,
    });//Middle ware으 라우트를 지정할수도 있다. path와 method가 해당하는 경우에만 middleware를 적용한다.
  }
}
