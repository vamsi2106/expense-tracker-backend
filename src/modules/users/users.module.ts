import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseConfigService } from '../../database/mssql/connection/connection.mssql';
import { UserDao } from 'src/database/mssql/dao/user.dao';
import { DbModule } from 'src/database/database.module';
import { User } from 'src/database/mssql/models/user.model';

@Module({
  imports: [
    DbModule,
    SequelizeModule.forFeature([User]),
    ],
  providers: [UserDao, UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
