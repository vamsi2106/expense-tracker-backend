// src/user/doa/user.dao.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { Role } from 'src/core/enums/roles.enum';

@Injectable()
export class UserDao {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}

  async createUser(
    username: string,
    email: string,
    role?: Role,
    userImageUrl?: any,
  ): Promise<User> {
    console.log('Creating user DAO:', username, email, role, userImageUrl);
    return await this.userModel.create({ username, email, role, userImageUrl });
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.findAll();
  }

  async findUserById(id: string) {
    return await this.userModel.findByPk(id);
  }

  async findUserByName(username: string): Promise<User> {
    return await this.userModel.findOne({
      where: { username: username },
    });
  }
  async findUserByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({
      where: { email: email },
    });
  }

  async updateUserById(id: string, userData: Partial<User>) {
    return await this.userModel.update(userData, {
      where: { userId: id },
    });
  }

  async deleteUserById(id: string) {
    return await this.userModel.destroy({ where: { userId: id } });
  }
}
