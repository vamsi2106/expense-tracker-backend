import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DbModule } from 'src/database/database.module';

@Module({
  imports: [SequelizeModule.forFeature([User]),DbModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
