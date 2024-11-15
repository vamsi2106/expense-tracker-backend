import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ExpenseDao } from 'src/database/mssql/dao/expenses.dao';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { handleResponse, ResponseSchema } from 'src/common/handleResponse';
import { ExpenseQueryDto } from './DTO/expenseQuery.dto';
import { AbstractExpenseDao } from 'src/database/mssql/abstract/expenseDao.abstract';
import { ResponseMessages } from 'src/common/messages';
import { DatabaseService } from 'src/database/database.service';
import { AbstractExpense } from './expense.abstract';

@Injectable()
export class ExpenseService implements AbstractExpense{
  private logger = new Logger(ExpenseService.name)
  private readonly _expenseTxn: AbstractExpenseDao
  constructor(private readonly _dbSvc : DatabaseService) {
    this._expenseTxn = this._dbSvc.expenseSqlTxn;
   }

  async create(expenseData: CreateExpenseDto, userId: string, options?: any): Promise<ResponseSchema> {
    try {
      const result = await this._expenseTxn.createExpense(expenseData, userId, options);
      if (!result) {
        return handleResponse({ message: ResponseMessages.EPE, status: HttpStatus.INTERNAL_SERVER_ERROR });
      }
      return result;
    } catch (e) {
      throw e; // Re-throw the error to be handled by the caller
    }
  }

  // Fetching all expenses for a specific user, with optional date filtering
  async findAll(userId:string, query: ExpenseQueryDto):Promise<ResponseSchema> {
    return await this._expenseTxn.findAllExpenses(userId, query);
  }

  // Fetching a specific expense by ID for a specific user
  async findOne(userId: string, id: string):Promise<ResponseSchema> {
    return await this._expenseTxn.findExpenseById(userId, id);
  }

  // Updating a specific expense by ID for a specific user
  async update(userId: string, id: string, updateExpenseDto: UpdateExpenseDto): Promise<ResponseSchema> {
    return await this._expenseTxn.updateExpense(userId, id, updateExpenseDto);
  }

  // Removing a specific expense by ID for a specific user
  async remove(userId: string, id: string):Promise<ResponseSchema> {
    return await this._expenseTxn.deleteExpense(userId, id);
  }

  // Deleting expenses by `fileId`, also ensuring user scope
  async deleteExpensesByFileId(userId: string, fileId: string, options?: any): Promise<ResponseSchema> {
    return await this._expenseTxn.deleteExpensesByFileId(userId, fileId, options);
  }

  // Query-based methods, scoped to the user

  // Group by date with an offset
  async getExpensesGroupedByDateWithOffset(userId: string, offset: number, file_id: string | null): Promise<ResponseSchema> {
    return await this._expenseTxn.getExpensesGroupedByDateWithOffset(userId, offset, file_id);
  }

  // Group by category within a date range
  async getExpensesGroupedByCategory(userId: string, file_id: string | null, startDate?: string, endDate?: string): Promise<ResponseSchema> {
    return await this._expenseTxn.getExpensesGroupedByCategory(userId, startDate, endDate, file_id);
  }

  // Group by week for a given month and year
  async getExpensesGroupedByWeek(userId: string, month: number, year: number, file_id: string | null): Promise<ResponseSchema> {
    console.log(userId, month, year, file_id, "from services");
    return await this._expenseTxn.getExpensesGroupedByWeek(userId, month, year, file_id);
  }

  // Group by month for a given year
  async getExpensesGroupedByMonth(userId: string, file_id: string | null, year: number): Promise<ResponseSchema> {
    return await this._expenseTxn.getExpensesGroupedByMonth(userId, year, file_id);
  }

  async getlength(user_id:string):Promise<ResponseSchema> {
    return await this._expenseTxn.getTotalLength(user_id);
  }

  // Group by year
  // async getExpensesGroupedByYear(userId: string, file_id: string | null) {
  //   return await this.expenseDao.getExpensesGroupedByYear(userId, file_id);
  // }
}
