import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { UsersService } from './users.service';
import { User } from 'src/database/mssql/models/user.model';
import { JwtAuthGuard } from '../auth/jwt-auth-guard.guard';
import { Role } from 'src/core/enums/roles.enum';
import { RoleGuard } from '../auth/role.guard';
import { Roles } from '../auth/role.decorator';
import { Request } from 'express';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly emailService: EmailService,
  ) {}

  @Post('check-email')
  async checkEmail(@Body('email') email: string) {
    const user = await this.userService.findUserByEmail(email);
    return { userFound: !!user }; // Return true if user exists, false otherwise
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.admin)
  @Get()
  async findAll() {
    return this.userService.findAllUsers();
  }

  @UseGuards(JwtAuthGuard, RoleGuard) // Protect route with JWT and RBAC
  @Roles(Role.admin) // Only admins can access this
  @Post('register')
  async registerUser(
    @Body() createUserDto: CreateUserDto,
    @Req() req: Request,
  ) {
    const { username, email, role } = createUserDto;

    // Create the user in the database
    const user = await this.userService.createUser(username, email, role);

    // Generate a login link or invitation link
    // const invitationLink = `http://localhost:3000/login`; // Generate a token or unique link
    // const subject = 'Invitation to Join';
    // const text = `You have been invited to join our platform.`;
    // const html = `<p>You have been invited to join our platform. Please click the link to register.</p>`;

    try {
      await this.emailService.sendInvitationEmail(email, username);
    } catch (error) {
      console.error('Error inviting user:', error);
      throw error;
    }

    return {
      message: 'User registered successfully and invitation sent.',
    };
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.admin)
  @Get(':id')
  async findUserById(@Param('id') id: string) {
    return await this.userService.findUserById(id);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.admin)
  @Get('username/:username')
  async findUserByName(@Param('username') username: string) {
    return await this.userService.findUserByName(username);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.admin)
  @Get('email/:email')
  async findUserByEmail(@Param('email') email: string) {
    return await this.userService.findUserByEmail(email);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.admin)
  @Put('update/:id')
  async updateUserById(@Param('id') id: string, @Body() body: Partial<User>) {
    return await this.userService.updateUserById(id, body);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.admin)
  @Delete('remove/:id')
  async deleteUserById(@Param('id') id: string) {
    return await this.userService.deleteUserById(id);
  }
}
