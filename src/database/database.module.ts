import { Module } from '@nestjs/common';
import { DatabaseConfigService } from './mssql/connection/connection.mssql';
import { UserDao } from './mssql/dao/user.dao';
import { SequelizeModule } from '@nestjs/sequelize';
import { DatabaseService } from './database.service';
import { User } from './mssql/models/user.model';
import { Expense } from './mssql/models/expenses.models';
import { ExpenseDao } from './mssql/dao/expenses.dao';
import { DaoList, SchemasList } from './mssql/connection/schemas.mssql';
import { Category } from './mssql/models/category.models';

@Module({
  imports: [DatabaseConfigService, SequelizeModule.forFeature(SchemasList)],
  providers: [DatabaseService, ...DaoList],
  exports: [DatabaseService, ...DaoList],
})
export class DbModule {}
