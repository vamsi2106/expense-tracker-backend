// src/modules/admin/admin.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../modules/auth/jwt-auth-guard.guard';
import { RoleGuard } from '../modules/auth/role.guard';
import { Roles } from '../modules/auth/role.decorator';
import { Role } from 'src/core/enums/roles.enum';
import { User } from 'src/database/mssql/models/user.model';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.admin)
  @Post('invite')
  async inviteUser(
    @Body() body: { email: string; username: string; role: Role },
  ) {
    return this.adminService.inviteUser(body.email, body.username, body.role);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.admin)
  @Get('users')
  async findAllUsers() {
    return this.adminService.findAllUsers();
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.admin)
  @Get('users/:id')
  async findUserById(@Param('id') id: string) {
    return this.adminService.findUserById(id);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.admin)
  @Put('users/update/:id')
  async updateUser(@Param('id') id: string, @Body() body: Partial<User>) {
    return this.adminService.updateUser(id, body);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.admin)
  @Delete('users/remove/:id')
  async deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }
}
