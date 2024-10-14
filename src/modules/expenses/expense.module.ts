import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { Expense } from 'src/database/mssql/models/expenses.models';
import { ExpenseDao } from 'src/database/mssql/dao/expense.mgmt';
import { DbModule } from 'src/database/database.module';

@Module({
  imports: [SequelizeModule.forFeature([Expense]), DbModule],
  controllers: [ExpenseController],
  providers: [ExpenseService, ExpenseDao],
})
export class ExpenseModule {}
