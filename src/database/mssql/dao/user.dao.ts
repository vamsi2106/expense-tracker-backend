// src/user/doa/user.dao.ts
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { User } from '../models/user.model';
import { Role } from 'src/core/enums/roles.enum';
import { TryCatchBlock } from 'src/common/tryCatchBlock';
import { ResponseMessages } from 'src/common/messages';
import { handleResponse, ResponseSchema } from 'src/common/handleResponse';
import { AbstractUserDao } from '../abstract/userDao.abstract';
import { msSqlConstants } from '../connection/constants.mssql';

@Injectable()
export class UserDao implements AbstractUserDao{
  constructor(@Inject(msSqlConstants.User) private readonly userModel: typeof User) {}

  async createUser(
    username: string,
    email: string,
    role?: Role,
    userImageUrl?: any,
  ): Promise<User> {
     return await this.userModel.create({ username, email, role, userImageUrl });
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.findAll();
  }

  async findUserById(id: string):Promise<any> {
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

  async deleteUserById(id: string):Promise<any> {
    return await this.userModel.destroy({ where: { userId: id } });
  }

  async getUserSize():Promise<ResponseSchema>{
    return TryCatchBlock(async ()=>{
        let response = await this.userModel.count();
        return handleResponse({status:HttpStatus.OK, message:ResponseMessages.GS, response:{size:response}})
    })
}
}
