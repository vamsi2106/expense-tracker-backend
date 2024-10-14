import { Module } from '@nestjs/common';
import { DatabaseConfigService } from './mssql/connection/connection.mssql';

import { UserDao } from './mssql/dao/user.dao';
import { SequelizeModule } from '@nestjs/sequelize';
import { DatabaseService } from './database.service';
import { User } from './mssql/models/user.model';
import { Expense } from './mssql/models/expenses.models';
import { ExpenseDao } from './mssql/dao/expense.mgmt';

@Module({
  imports: [DatabaseConfigService, SequelizeModule.forFeature([User, Expense])],
  providers: [DatabaseService, UserDao, ExpenseDao],
  exports: [DatabaseService, UserDao, ExpenseDao],
})
export class DbModule {}
