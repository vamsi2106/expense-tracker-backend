// import { Injectable } from '@nestjs/common';
// import { ExpenseDao } from 'src/database/mssql/dao/expense.mgmt';
// import { CreateExpenseDto } from './dto/create-expense.dto';
// import { UpdateExpenseDto } from './dto/update-expense.dto';

// @Injectable()
// export class ExpenseService {
//   constructor(private readonly expenseDao: ExpenseDao) {}

//   // create(createExpenseDto: CreateExpenseDto) {
//   //   return this.expenseDao.createExpense(createExpenseDto);
//   // }

//   async create(userId:string ,expenseData: CreateExpenseDto, options?: any) {
//     return this.expenseDao.createExpense(expenseData, options);
//   }
  

//   findAll(userId:string, startDate?: string, endDate?: string, filter?: string) {
//     return this.expenseDao.findAllExpenses(startDate, endDate, filter);
//   }

//   findOne(id: string) {
//     return this.expenseDao.findExpenseById(id);
//   }

//   update(id: string, updateExpenseDto: UpdateExpenseDto) {
//     return this.expenseDao.updateExpense(id, updateExpenseDto);
//   }

//   remove(id: string) {
//     return this.expenseDao.deleteExpense(id);
//   }

//   async deleteExpensesByFileId(fileId: string, options?: any): Promise<boolean> {
//     return this.expenseDao.deleteExpensesByFileId(fileId, options);
//   }

//   //querry code
//   // Service method to call DAO for expenses grouped by date with offset
//   async getExpensesGroupedByDateWithOffset(offset: number, file_id: string | null) {
//     return await this.expenseDao.getExpensesGroupedByDateWithOffset(offset, file_id);
//   }

//   // 2. Group by Category
//   async getExpensesGroupedByCategory(file_id: string | null, startDate?: string, endDate?: string) {
//     return await this.expenseDao.getExpensesGroupedByCategory(startDate, endDate, file_id);
//   }

//   // 3. Group by Week
//   async getExpensesGroupedByWeek(month: number, year: number, file_id: string | null) {
//     return await this.expenseDao.getExpensesGroupedByWeek(month, year, file_id);
//   }

//   // 4. Group by Month
//   async getExpensesGroupedByMonth(file_id: string | null, year: number) {
//     return await this.expenseDao.getExpensesGroupedByMonth(year, file_id);
//   }

//   // 5. Group by Year
//   async getExpensesGroupedByYear(file_id: string | null) {
//     return await this.expenseDao.getExpensesGroupedByYear(file_id);
//   }
// }

import { Injectable } from '@nestjs/common';
import { ExpenseDao } from 'src/database/mssql/dao/expenses.dao';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpenseService {
  constructor(private readonly expenseDao: ExpenseDao) {}

  // async get(name:string){
  //   return this.expenseDao.get(name);
  // }

  // Creating a new expense, ensuring it is tied to a specific user
  async create(expenseData: CreateExpenseDto, userId:string, options?: any) {
    return this.expenseDao.createExpense(expenseData, userId, options);
  }

  // Fetching all expenses for a specific user, with optional date filtering
  findAll(userId: string, startDate?: string, endDate?: string, filter?: string, transactionType?:string,currency?:string,limit?:number,offset?:number) {
    return this.expenseDao.findAllExpenses(userId, startDate, endDate, filter, transactionType,currency,limit,offset);
  }

  // Fetching a specific expense by ID for a specific user
  findOne(userId: string, id: string) {
    return this.expenseDao.findExpenseById(userId, id);
  }

  // Updating a specific expense by ID for a specific user
  update(userId: string, id: string, updateExpenseDto: UpdateExpenseDto) {
    return this.expenseDao.updateExpense(userId, id, updateExpenseDto);
  }

  // Removing a specific expense by ID for a specific user
  remove(userId: string, id: string) {
    return this.expenseDao.deleteExpense(userId, id);
  }

  // Deleting expenses by `fileId`, also ensuring user scope
  async deleteExpensesByFileId(userId: string, fileId: string, options?: any): Promise<boolean> {
    return this.expenseDao.deleteExpensesByFileId(userId, fileId, options);
  }

  // Query-based methods, scoped to the user

  // Group by date with an offset
  async getExpensesGroupedByDateWithOffset(userId: string, offset: number, file_id: string | null) {
    return await this.expenseDao.getExpensesGroupedByDateWithOffset(userId, offset, file_id);
  }

  // Group by category within a date range
  async getExpensesGroupedByCategory(userId: string, file_id: string | null, startDate?: string, endDate?: string) {
    return await this.expenseDao.getExpensesGroupedByCategory(userId, startDate, endDate, file_id);
  }

  // Group by week for a given month and year
  async getExpensesGroupedByWeek(userId: string, month: number, year: number, file_id: string | null) {
    return await this.expenseDao.getExpensesGroupedByWeek(userId, month, year, file_id);
  }

  // Group by month for a given year
  async getExpensesGroupedByMonth(userId: string, file_id: string | null, year: number) {
    return await this.expenseDao.getExpensesGroupedByMonth(userId, year, file_id);
  }

  // Group by year
  // async getExpensesGroupedByYear(userId: string, file_id: string | null) {
  //   return await this.expenseDao.getExpensesGroupedByYear(userId, file_id);
  // }
}
