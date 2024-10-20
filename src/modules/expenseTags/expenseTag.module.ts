import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Expense } from 'src/database/mssql/models/expenses.models';
import { DbModule } from 'src/database/database.module';
import { ExpenseTagController } from './expenseTag.controller';
import { ExpenseTagService } from './expenseTag.service';
import { ExpenseService } from '../expenses/expense.service';
import { ExpenseTag } from 'src/database/mssql/models/expenseTags.models';
import { ExpenseTagDao } from 'src/database/mssql/dao/expenseTags.dao';

@Module({
  imports: [SequelizeModule.forFeature([ExpenseTag]), DbModule],
  controllers: [ExpenseTagController],
  providers: [ExpenseTagService, ExpenseTagDao],
})
export class ExpenseTagModule {}
