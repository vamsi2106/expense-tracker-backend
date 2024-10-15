// src/modules/admin/admin.service.ts
import { Injectable } from '@nestjs/common';
import { UsersService } from '../modules/users/users.service';
import { User } from 'src/database/mssql/models/user.model';
import { Role } from 'src/core/enums/roles.enum';

@Injectable()
export class AdminService {
  constructor(private readonly usersService: UsersService) {}

  async inviteUser(email: string, username: string, role: Role): Promise<any> {
    // Logic for sending an invitation email
    // Send invitation email using your preferred method
    return this.usersService.createUser(username, email, role);
  }

  async findAllUsers(): Promise<User[]> {
    return this.usersService.findAllUsers();
  }

  async findUserById(id: string) {
    return this.usersService.findUserById(id);
  }

  async updateUser(id: string, userData: Partial<User>) {
    return this.usersService.updateUserById(id, userData);
  }

  async deleteUser(id: string) {
    return this.usersService.deleteUserById(id);
  }
}
