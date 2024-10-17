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
  async getExpensesGroupedByDateWithOffset(offset: number, file_id: string | null) {
    return await this.expenseDao.getExpensesGroupedByDateWithOffset(offset, file_id);
  }

  // 2. Group by Category
  async getExpensesGroupedByCategory(file_id: string | null, startDate?: string, endDate?: string) {
    return await this.expenseDao.getExpensesGroupedByCategory(startDate, endDate, file_id);
  }

  // 3. Group by Week
  async getExpensesGroupedByWeek(month: number, year: number, file_id: string | null) {
    return await this.expenseDao.getExpensesGroupedByWeek(month, year, file_id);
  }

  // 4. Group by Month
  async getExpensesGroupedByMonth(file_id: string | null, year: number) {
    return await this.expenseDao.getExpensesGroupedByMonth(year, file_id);
  }

  // 5. Group by Year
  async getExpensesGroupedByYear(file_id: string | null) {
    return await this.expenseDao.getExpensesGroupedByYear(file_id);
  }
}