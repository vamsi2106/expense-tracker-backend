import { Module } from '@nestjs/common';
//import { SequelizeModule } from '@nestjs/sequelize';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { Expense } from 'src/database/mssql/models/expenses.models';
import { ExpenseDao } from 'src/database/mssql/dao/expenses.dao';
import { DbModule } from 'src/database/database.module';
import { Category } from 'src/database/mssql/models/category.models';
import { AbstractExpense } from './expense.abstract';

@Module({
  //imports: [SequelizeModule.forFeature([Expense, Category]), DbModule],
  controllers: [ExpenseController],
  providers: [{provide:AbstractExpense,useClass:ExpenseService}],
})
export class ExpenseModule {}
