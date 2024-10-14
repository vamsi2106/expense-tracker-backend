import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: { username: string; email: string }): Promise<User> {
    return this.userService.createUser(createUserDto.username, createUserDto.email);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAllUsers();
  }
}
