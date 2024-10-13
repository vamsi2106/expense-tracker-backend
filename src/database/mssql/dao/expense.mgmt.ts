import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Expense } from '../models/expenses.models';
import { CreateExpenseDto } from 'src/modules/expenses/dto/create-expense.dto';
import { UpdateExpenseDto } from 'src/modules/expenses/dto/update-expense.dto';

@Injectable()
export class ExpenseDao {
    constructor(
        @InjectModel(Expense)  // Sequelize model injection
        private readonly expenseModel: typeof Expense,  // Ensure this matches
      ) {}

  async createExpense(createExpenseDto: CreateExpenseDto): Promise<Expense> {
    return this.expenseModel.create({...createExpenseDto});
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

  async findExpenseById(id: number): Promise<Expense> {
    return this.expenseModel.findByPk(id);
  }

  async updateExpense(id: number, updateExpenseDto: UpdateExpenseDto): Promise<[number]> {
    return this.expenseModel.update(updateExpenseDto, { where: { id } });
  }

  async deleteExpense(id: number): Promise<void> {
    await this.expenseModel.destroy({ where: { id } });
  }
}
