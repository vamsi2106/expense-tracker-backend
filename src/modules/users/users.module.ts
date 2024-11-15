// src/modules/users/users.module.ts
import { Module } from '@nestjs/common';
import { EmailModule } from 'src/email/email.module';
import { CustomSendGridModule } from '../sendgrid/sendgrid.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AbstractUser } from './user.abstract';

@Module({
  imports: [CustomSendGridModule, EmailModule],
  providers: [{
    provide: AbstractUser,
    useClass: UsersService
  }],
  controllers: [UsersController],
  exports: [{
    provide: AbstractUser,
    useClass: UsersService
  }],
})
export class UsersModule { }
