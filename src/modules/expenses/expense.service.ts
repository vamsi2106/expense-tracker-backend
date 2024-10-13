import { Injectable } from '@nestjs/common';
import { ExpenseDao } from 'src/database/mssql/dao/expense.mgmt';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpenseService {
  constructor(private readonly expenseDao: ExpenseDao) {}

  create(createExpenseDto: CreateExpenseDto) {
    return this.expenseDao.createExpense(createExpenseDto);
  }

  findAll(startDate?: string, endDate?: string, filter?: string) {
    return this.expenseDao.findAllExpenses(startDate, endDate, filter);
  }

  findOne(id: number) {
    return this.expenseDao.findExpenseById(id);
  }

  update(id: number, updateExpenseDto: UpdateExpenseDto) {
    return this.expenseDao.updateExpense(id, updateExpenseDto);
  }

  remove(id: number) {
    return this.expenseDao.deleteExpense(id);
  }
}
