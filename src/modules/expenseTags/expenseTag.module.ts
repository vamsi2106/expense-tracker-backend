import { Module } from '@nestjs/common';
//import { SequelizeModule } from '@nestjs/sequelize';
import { Expense } from 'src/database/mssql/models/expenses.models';
import { DbModule } from 'src/database/database.module';
import { ExpenseTagController } from './expenseTag.controller';
import { ExpenseTagService } from './expenseTag.service';
import { ExpenseService } from '../expenses/expense.service';
import { ExpenseTag } from 'src/database/mssql/models/expenseTags.models';
import { ExpenseTagDao } from 'src/database/mssql/dao/expenseTags.dao';
import { AbstractExpenseTag } from './expenseTag.abstract';

@Module({
  imports: [
    // SequelizeModule.forFeature([ExpenseTag])
  ],
  controllers: [ExpenseTagController],
  providers: [
    {
      provide: AbstractExpenseTag,
      useClass: ExpenseTagService
    }
  ],
})
export class ExpenseTagModule { }
