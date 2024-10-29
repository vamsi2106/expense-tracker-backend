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
import { TaskManager } from '../tasks/task.module';
import { RecurringTaskModule } from '../recurringExpenses/recurringExpense.module';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from 'src/logger/globalExeption.filter'; // Path to your exception filter

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
    ExpenseTagModule,
   // TaskManager,
    RecurringTaskModule
  ],
  controllers: [AppController],
  providers: [AppService,AppLogger,{
    provide: APP_FILTER,
    useClass: GlobalExceptionFilter,
  }],
  exports: [AppService,AppLogger],
})
export class AppModule {}