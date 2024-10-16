// src/modules/users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DbModule } from 'src/database/database.module';
import { UserDao } from 'src/database/mssql/dao/user.dao';
import { CustomSendGridModule } from '../sendgrid/sendgrid.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [DbModule, CustomSendGridModule, EmailModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
