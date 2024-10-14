import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {  DbModule } from 'src/database/database.module';
import { UserDao } from 'src/database/mssql/dao/user.dao';

@Module({
  imports: [DbModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
