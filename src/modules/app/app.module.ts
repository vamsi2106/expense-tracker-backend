import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { DbModule } from '../../database/database.module';
import { ExpenseModule } from '../expenses/expense.module';
import { FileModule } from '../files/files.modules';
import { AppLogger } from 'src/logger/app-logger';
import { CategoryModule } from '../categories/category.module';
import { ExpenseTagModule } from '../expenseTags/expenseTag.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DbModule,
    AuthModule,
    UsersModule,
    ExpenseModule,
    FileModule,
    CategoryModule,
    ExpenseTagModule
  ],
  controllers: [AppController],
  providers: [AppService,AppLogger],
  exports: [AppService,AppLogger],
})
export class AppModule {}