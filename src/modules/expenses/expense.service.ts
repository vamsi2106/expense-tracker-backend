import { Injectable } from '@nestjs/common';
import { ExpenseDao } from 'src/database/mssql/dao/expense.mgmt';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpenseService {
  constructor(private readonly expenseDao: ExpenseDao) {}

  // create(createExpenseDto: CreateExpenseDto) {
  //   return this.expenseDao.createExpense(createExpenseDto);
  // }

  async create(expenseData: CreateExpenseDto, options?: any) {
    return this.expenseDao.createExpense(expenseData, options);
  }
  

  findAll(startDate?: string, endDate?: string, filter?: string) {
    return this.expenseDao.findAllExpenses(startDate, endDate, filter);
  }

  findOne(id: string) {
    return this.expenseDao.findExpenseById(id);
  }

  update(id: string, updateExpenseDto: UpdateExpenseDto) {
    return this.expenseDao.updateExpense(id, updateExpenseDto);
  }

  remove(id: string) {
    return this.expenseDao.deleteExpense(id);
  }

  async deleteExpensesByFileId(fileId: string, options?: any): Promise<boolean> {
    return this.expenseDao.deleteExpensesByFileId(fileId, options);
  }

  //querry code
  // Service method to call DAO for expenses grouped by date with offset
  async getExpensesGroupedByDateWithOffset(offset: number = 0) {
    return this.expenseDao.getExpensesGroupedByDateWithOffset(offset);
  }

  // Service method to call DAO for expenses grouped by category
  async getExpensesGroupedByCategory(startDate?: string, endDate?: string) {
    return this.expenseDao.getExpensesGroupedByCategory(startDate, endDate);
  }

  async getExpensesGroupedByWeek(month:number,year:number){
    return this.expenseDao.getExpensesGroupedByWeek(month,year);
  }
  async getExpensesGroupedByMonth(year?: number) {
    return this.expenseDao.getExpensesGroupedByMonth(year);
  }

  async getExpensesGroupedByYear(): Promise<any[]> {
    return this.expenseDao.getExpensesGroupedByYear();
}

}