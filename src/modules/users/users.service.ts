// src/modules/users/users.service.ts
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserDao } from '../../database/mssql/dao/user.dao';
import { User } from '../../database/mssql/models/user.model';
import { Role } from 'src/core/enums/roles.enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AbstractUserDao } from 'src/database/mssql/abstract/userDao.abstract';
import { DatabaseService } from 'src/database/database.service';
import { AbstractUser } from './user.abstract';

@Injectable()
export class UsersService implements AbstractUser{
  private readonly _userTxn: AbstractUserDao
  constructor(private readonly _dbSvc: DatabaseService) {
    this._userTxn = _dbSvc.userSqlTxn;
  }

  async createUser(
    username: string,
    email: string,
    role?: Role,
    userImageUrl?: any,
  ): Promise<User> {
    try {
      const user = await this._userTxn.createUser(
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
    return await this._userTxn.findAll();
  }

  async findUserById(id: string) {
    return await this._userTxn.findUserById(id);
  }

  async findUserByName(username: string) {
    return await this._userTxn.findUserByName(username);
  }
  async findUserByEmail(email: string) {
    return await this._userTxn.findUserByEmail(email);
  }

  async updateUserById(id: string, userData: Partial<User>) {
    return await this._userTxn.updateUserById(id, userData);
  }

  async deleteUserById(id: string) {
    return await this._userTxn.deleteUserById(id);
  }

  async getSize(){
    return await this._userTxn.getUserSize();
  }
}
