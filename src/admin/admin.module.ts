// src/modules/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../database/mssql/models/user.model';

@Module({
  imports: [User],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
