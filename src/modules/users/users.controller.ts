import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/database/mssql/models/user.model';

@Controller('users')
export class UsersController {
    constructor(private readonly userService:UsersService){}

    @Post()
    async create(@Body() body: { username: string; email: string, role?:"admin" | "user" }) {
        return this.userService.createUser(body.username, body.email,body.role);
    }

    @Get()
    async findAll(){
        return this.userService.findAllUsers()
    }

    @Get(":id")
    async findUserById(@Param("id") id:string){
        return await this.userService.findUserById(id);
    }

    @Get("username/:username")
    async findUserByName(@Param("username") username:string){
        return await this.userService.findUserByName(username);
    }
    
    @Get("email/:email")
    async findUserByEmail(@Param("email") email:string){
        return await this.userService.findUserByEmail(email);
    }

    @Put("update/:id")
    async updateUserById(@Param("id") id:string, @Body() body:Partial<User> ){
        return await this.userService.updateUserById(id,body)
    }


    @Delete("remove/:id")
    async deleteUserById(@Param("id") id:string){
        return await this.userService.deleteUserById(id);
    }

}
