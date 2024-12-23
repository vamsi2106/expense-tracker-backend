// src/modules/users/users.service.ts
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserDao } from '../../database/mssql/dao/user.dao';
import { User } from '../../database/mssql/models/user.model';
import { Role } from 'src/core/enums/roles.enum';

@Injectable()
export class UsersService {
  constructor(private readonly userDao: UserDao) {}

  async createUser(
    username: string,
    email: string,
    role?: Role,
    userImageUrl?: any,
  ): Promise<User> {
    try {
      const user = await this.userDao.createUser(
        username,
        email,
        role,
        userImageUrl,
      );
      return user; // Return the created user
    } catch (error) {
      console.error('Error creating user:', error);
      throw new BadRequestException('Failed to create user'); // Throwing a user-friendly error
    }
  }

  async findAllUsers(): Promise<User[]> {
    return await this.userDao.findAll();
  }

  async findUserById(id: string) {
    return await this.userDao.findUserById(id);
  }

  async findUserByName(username: string) {
    return await this.userDao.findUserByName(username);
  }
  async findUserByEmail(email: string) {
    return await this.userDao.findUserByEmail(email);
  }

  async updateUserById(id: string, userData: Partial<User>) {
    return await this.userDao.updateUserById(id, userData);
  }

  async deleteUserById(id: string) {
    return await this.userDao.deleteUserById(id);
  }
}
