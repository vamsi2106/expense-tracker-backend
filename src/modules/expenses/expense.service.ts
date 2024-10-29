import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ExpenseDao } from 'src/database/mssql/dao/expenses.dao';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ResponseSchema } from 'src/common/handleResponse';

@Injectable()
export class ExpenseService {
  private logger = new Logger(ExpenseService.name)
  constructor(private readonly expenseDao: ExpenseDao) {}

  // async get(name:string){
  //   return this.expenseDao.get(name);
  // }

  // Creating a new expense, ensuring it is tied to a specific user
  // async create(expenseData: CreateExpenseDto, userId: string, options?: any): Promise<ResponseSchema> {
  //   try {
  //     console.log("Inside service file", expenseData, userId);
  //     this.logger.log("Inside service file", { expenseData, userId });
  //     const response = await this.expenseDao.createExpense(expenseData, userId, options);
  //     console.log("Expense creation response:", response);
  //     return response;
  //   } catch (e) {
  //     console.error("Error in expense service:", e.message);
  //     throw new HttpException(`Expense creation failed: ${e.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  //claude ai code
  async create(expenseData: CreateExpenseDto, userId: string, options?: any): Promise<ResponseSchema> {
    try {
      console.log("inside service file", expenseData, userId);
      this.logger.log("inside service file", {expenseData, userId});
      const result = await this.expenseDao.createExpense(expenseData, userId, options);
      if (!result) {
        throw new Error('Failed to create expense');
      }
      return result;
    } catch (e) {
      console.error("Error creating expense:", e.message);
      throw e; // Re-throw the error to be handled by the caller
    }
}
//end of claude ai code
  

  // Fetching all expenses for a specific user, with optional date filtering
  async findAll(userId: string, startDate?: string, endDate?: string, filter?: string, transactionType?:string,currency?:string,limit?:number,offset?:number) {
    return await this.expenseDao.findAllExpenses(userId, startDate, endDate, filter, transactionType,currency,limit,offset);
  }

  // Fetching a specific expense by ID for a specific user
  async findOne(userId: string, id: string) {
    return await this.expenseDao.findExpenseById(userId, id);
  }

  // Updating a specific expense by ID for a specific user
  async update(userId: string, id: string, updateExpenseDto: UpdateExpenseDto) {
    return await this.expenseDao.updateExpense(userId, id, updateExpenseDto);
  }

  // Removing a specific expense by ID for a specific user
  async remove(userId: string, id: string) {
    return await this.expenseDao.deleteExpense(userId, id);
  }

  // Deleting expenses by `fileId`, also ensuring user scope
  async deleteExpensesByFileId(userId: string, fileId: string, options?: any): Promise<ResponseSchema> {
    return await this.expenseDao.deleteExpensesByFileId(userId, fileId, options);
  }

  // Query-based methods, scoped to the user

  // Group by date with an offset
  async getExpensesGroupedByDateWithOffset(userId: string, offset: number, file_id: string | null): Promise<ResponseSchema> {
    return await this.expenseDao.getExpensesGroupedByDateWithOffset(userId, offset, file_id);
  }

  // Group by category within a date range
  async getExpensesGroupedByCategory(userId: string, file_id: string | null, startDate?: string, endDate?: string): Promise<ResponseSchema> {
    return await this.expenseDao.getExpensesGroupedByCategory(userId, startDate, endDate, file_id);
  }

  // Group by week for a given month and year
  async getExpensesGroupedByWeek(userId: string, month: number, year: number, file_id: string | null): Promise<ResponseSchema> {
    console.log(userId,month,year,file_id, "from services");
    return await this.expenseDao.getExpensesGroupedByWeek(userId, month, year, file_id);
  }

  // Group by month for a given year
  async getExpensesGroupedByMonth(userId: string, file_id: string | null, year: number): Promise<ResponseSchema> {
    return await this.expenseDao.getExpensesGroupedByMonth(userId, year, file_id);
  }

  // Group by year
  // async getExpensesGroupedByYear(userId: string, file_id: string | null) {
  //   return await this.expenseDao.getExpensesGroupedByYear(userId, file_id);
  // }
}
