import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async createUser(username: string, email: string): Promise<User> {
    const user = new User({ username, email });
    return user.save();
  }

  async findAllUsers(): Promise<User[]> {
    return this.userModel.findAll();
  }
}
