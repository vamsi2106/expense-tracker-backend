import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Expense } from '../models/expenses.models';
import { CreateExpenseDto } from 'src/modules/expenses/dto/create-expense.dto';
import { UpdateExpenseDto } from 'src/modules/expenses/dto/update-expense.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Op } from 'sequelize';
import * as moment from 'moment';
import { Sequelize as sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';

@Injectable()
export class ExpenseDao {
  constructor(
    @InjectModel(Expense)  // Sequelize model injection
    private readonly expenseModel: typeof Expense,  // Ensure this matches
  ) { }



  async createExpense(createExpenseDto: CreateExpenseDto, options?: any): Promise<Expense | void | null> {
    const { name, amount, date, category } = createExpenseDto;
    let updatedFullDate = new Date(date);
    console.log(updatedFullDate);
    // Check for existing expense with the same name, amount, date, and category
    const existingExpense = await this.expenseModel.findOne({
      where: {
        date: updatedFullDate,
        name,
        amount,
        category
      },
    });
    console.log(existingExpense);
    if (existingExpense) {
      // Throw an HttpException with proper status code for conflict
      throw new HttpException(
        'Expense with the same name, amount, date, and category already exists.',
        HttpStatus.CONFLICT
      );
    }

    // If no duplicates, create the expense and return it
    return this.expenseModel.create({ ...createExpenseDto }, options);
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

  async findExpenseById(id: string): Promise<Expense> {
    return this.expenseModel.findByPk(id);
  }

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

  //new code for chart query
  // Method to get expenses grouped by date with offset and file_id
  async getExpensesGroupedByDateWithOffset(offset: number = 0, file_id: string | null): Promise<any[]> {
    const end = moment().subtract(offset * 7, 'days').toDate();
    const start = moment(end).subtract(7, 'days').toDate();

    return await this.expenseModel.findAll({
      attributes: [
        [sequelize.literal('CONVERT(DATE, [date])'), 'date'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'total_amount'],
      ],
      where: {
        date: { [Op.between]: [start, end] },
        file_id: file_id // Always include file_id, even if null
      },
      group: ['date'],
      order: [['date', 'ASC']],
    });
  }

  // 2. Group by Category
  async getExpensesGroupedByCategory(startDate: string | null, endDate: string | null, file_id: string | null): Promise<any[]> {
    const start = startDate ? new Date(startDate) : moment().subtract(7, 'days').toDate();
    const end = endDate ? new Date(endDate) : new Date();

    return await this.expenseModel.findAll({
      where: {
        date: { [Op.between]: [start, end] },
        file_id: file_id
      },
      attributes: [
        'category',
        [sequelize.fn('SUM', sequelize.col('amount')), 'total_amount'],
      ],
      group: ['category'],
      order: [['category', 'ASC']],
    });
  }

  // 3. Group by Week
  async getExpensesGroupedByWeek(month: number, year: number, file_id: string | null): Promise<any[]> {
    console.log(year,month,file_id)
    return await this.expenseModel.sequelize.query(`
      SELECT 
        DATEPART(YEAR, [date]) AS [year], 
        DATEPART(MONTH, [date]) AS [month], 
        DATEPART(WEEK, [date]) AS [week], 
        SUM([amount]) AS [total_amount]
      FROM [expenses]
      WHERE DATEPART(YEAR, [date]) = :year AND DATEPART(MONTH, [date]) = :month AND (file_id = :file_id OR :file_id IS NULL)
      GROUP BY DATEPART(YEAR, [date]), DATEPART(MONTH, [date]), DATEPART(WEEK, [date])
      ORDER BY DATEPART(WEEK, [date]) ASC;
    `, {
      replacements: { month, year, file_id },
      type: QueryTypes.SELECT,
    });
  }

  // 4. Group by Month
  async getExpensesGroupedByMonth(year: number, file_id: string | null): Promise<any[]> {
    return await this.expenseModel.sequelize.query(`
      SELECT 
        DATEPART(YEAR, [date]) AS [year], 
        DATEPART(MONTH, [date]) AS [month], 
        SUM([amount]) AS [total_amount]
      FROM [expenses]
      WHERE DATEPART(YEAR, [date]) = :year AND (file_id = :file_id OR :file_id IS NULL)
      GROUP BY DATEPART(YEAR, [date]), DATEPART(MONTH, [date])
      ORDER BY DATEPART(MONTH, [date]) ASC;
    `, {
      replacements: { year, file_id },
      type: QueryTypes.SELECT,
    });
  }

  // 5. Group by Year
  async getExpensesGroupedByYear(file_id: string | null): Promise<any[]> {
    return await this.expenseModel.sequelize.query(`
      SELECT 
        DATEPART(YEAR, [date]) AS [year], 
        SUM([amount]) AS [total_amount]
      FROM [expenses]
      WHERE (file_id = :file_id OR :file_id IS NULL)
      GROUP BY DATEPART(YEAR, [date])
      ORDER BY [year] ASC;
    `, {
      replacements: { file_id },
      type: QueryTypes.SELECT,
    });
  }
}