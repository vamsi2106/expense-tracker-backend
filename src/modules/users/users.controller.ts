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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { EmailService } from 'src/email/email.service';
import { UsersService } from './users.service';
import { User } from 'src/database/mssql/models/user.model';
import { JwtAuthGuard } from '../auth/jwtAuthGuard.guard';
import { Role } from 'src/core/enums/roles.enum';
import { RoleGuard } from '../auth/role.guard';
import { Roles } from '../auth/role.decorator';
import { Request } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { AbstractUser } from './user.abstract';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: AbstractUser,
    private readonly emailService: EmailService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        email: { type: 'string' },
        role: { type: 'string', enum: Object.values(Role) },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() body: { username: string; email: string; role: Role }) {
    return this.userService.createUser(body.username, body.email, body.role);
  }

  @Post('check-email')
  @ApiOperation({ summary: 'Check if email already exists' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Check email response' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async checkEmail(@Body('email') email: string) {
    const user = await this.userService.findUserByEmail(email);
    return { userFound: !!user };
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.admin)
  @Get()
  @ApiOperation({ summary: 'Retrieve all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findAll() {
    return this.userService.findAllUsers();
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.admin)
  @Post('register')
  @ApiOperation({ summary: 'Register a new user and send an invitation email (Admin only)' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User registered and invitation email sent' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async registerUser(
    @Body() createUserDto: CreateUserDto,
    @Req() req: Request,
  ) {
    const { username, email, role, userImageUrl } = createUserDto;
    const user = await this.userService.createUser(
      username,
      email,
      role,
      userImageUrl,
    );
    await this.emailService.sendInvitationEmail(email, username);
    return {
      message: 'User registered successfully and invitation sent.',
    };
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.admin)
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a user by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findUserById(@Param('id') id: string) {
    return await this.userService.findUserById(id);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.admin)
  @Get('username/:username')
  @ApiOperation({ summary: 'Retrieve a user by username (Admin only)' })
  @ApiParam({ name: 'username', description: 'Username' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findUserByName(@Param('username') username: string) {
    return await this.userService.findUserByName(username);
  }

  @UseGuards(JwtAuthGuard,RoleGuard)
  @Roles(Role.admin)
  @Get('/fetch/size')
  @ApiOperation({ summary: 'Get the number of users in tabel'})
  async findUSersCount(){
    return await this.userService.getSize();
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.admin)
  @Get('email/:email')
  @ApiOperation({ summary: 'Retrieve a user by email (Admin only)' })
  @ApiParam({ name: 'email', description: 'User email' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findUserByEmail(@Param('email') email: string) {
    return await this.userService.findUserByEmail(email);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.admin)
  @Put('update/:id')
  @ApiOperation({ summary: 'Update a user by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ schema: { type: 'object' } })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateUserById(@Param('id') id: string, @Body() body: Partial<User>) {
    return await this.userService.updateUserById(id, body);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.admin)
  @Delete('remove/:id')
  @ApiOperation({ summary: 'Delete a user by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUserById(@Param('id') id: string) {
    return await this.userService.deleteUserById(id);
  }
}
