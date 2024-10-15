import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Expense } from '../models/expenses.models';
import { CreateExpenseDto } from 'src/modules/expenses/dto/create-expense.dto';
import { UpdateExpenseDto } from 'src/modules/expenses/dto/update-expense.dto';
import {v4 as uuid} from 'uuid';

@Injectable()
export class ExpenseDao {
    constructor(
        @InjectModel(Expense)  // Sequelize model injection
        private readonly expenseModel: typeof Expense,  // Ensure this matches
      ) {}

  async createExpense(createExpenseDto: CreateExpenseDto,options?:null) {
    //let expenseId = uuid();
    return this.expenseModel.create({...createExpenseDto},options);
  }

  async findAllExpenses(startDate?: string, endDate?: string, filter?: string): Promise<Expense[]> {
    const whereClause: any = {};
    if (startDate && endDate) {
      whereClause.date = { $between: [startDate, endDate] };
    }
    if (filter) {
      whereClause.category = filter;
    }
    return this.expenseModel.findAll({ where: whereClause });
  }

  // async findExpenseById(id: number): Promise<Expense> {
  //   return this.expenseModel.findByPk(id);
  // }

  async updateExpense(id: string, updateExpenseDto: UpdateExpenseDto): Promise<Expense | null> {
    const expense = await this.expenseModel.findByPk(id);
    
    if (!expense) return null; // Expense not found
  
    return expense.update(updateExpenseDto); // This updates and returns the updated instance
  }
  
  async deleteExpense(id: string): Promise<boolean> {
    const expense = await this.expenseModel.findByPk(id);
    
    if (!expense) return false; // Expense not found
  
    await expense.destroy(); // Delete the expense
    return true; // Deletion was successful
  }

  
  async deleteExpensesByFileId(fileId: string, options?: any): Promise<boolean> {
    const deletedCount = await this.expenseModel.destroy({
      where: { file_id: fileId },
      ...options, // Pass options to support transactions
    });
    
    return deletedCount > 0; // Return true if any expenses were deleted
  }
}