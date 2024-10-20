import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Expense } from '../models/expenses.models';
import { CreateExpenseDto } from 'src/modules/expenses/dto/create-expense.dto';
import { UpdateExpenseDto } from 'src/modules/expenses/dto/update-expense.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Op } from 'sequelize';
import * as moment from 'moment';
import { Sequelize, Sequelize as sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';
import { Category } from '../models/category.models';
import { CategoryDao } from './category.dao';

@Injectable()
export class ExpenseDao {
  constructor(
    @InjectModel(Expense)  // Sequelize model injection
    private readonly expenseModel: typeof Expense,  // Ensure this matches
    @Inject(CategoryDao)
    private readonly categoryDao = new CategoryDao(),
    @InjectModel(Category)
    private categoryModel: typeof Category,
    @Inject(Sequelize) // Use the Sequelize injection here
    private sequelize: Sequelize
  ) { }

  private async getCategoryId(category: string, userId: string): Promise<string> {
    const categoryResult: any = await this.categoryDao.getCategoryByName(category, userId);

    if (!categoryResult) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    return categoryResult.id;
  }


  async createExpense(
    createExpenseDto: CreateExpenseDto,
    userId: string,
    options?: any
  ): Promise<Expense | void | null> {
    const { name, amount, date, category, description, transaction_type, currency, file_id } = createExpenseDto;

    // Convert date to the proper format (ISO string)
    const updatedFullDate = new Date(date).toISOString();
    console.log('Converted Date:', updatedFullDate);

    try {
      // Retrieve category ID
      createExpenseDto.category = await this.getCategoryId(category, userId);
      console.log('Category ID:', createExpenseDto.category);

      // Check for existing expense with the same name, amount, date, and category
      const existingExpense = await this.expenseModel.findOne({
        where: {
          name,
          category_id: createExpenseDto.category,
          date: updatedFullDate,
          user_id: userId,
          transaction_type: transaction_type,
          currency: currency
        },
      });

      console.log('Existing Expense:', existingExpense);

      if (existingExpense) {
        throw new HttpException(
          'Expense with the same name, amount, date, and category already exists.',
          HttpStatus.CONFLICT
        );
      }

      // Prepare expense data for creation
      const createExpenseData = {
        user_id: userId,
        name,
        category_id: createExpenseDto.category,
        transaction_type,
        amount: Number(amount), // Ensure amount is a number
        date: updatedFullDate,
        currency,
        description,
        file_id
      };

      console.log('Create Expense Data:', createExpenseData);

      // Create the expense
      return await this.expenseModel.create(createExpenseData, options);
    } catch (error) {
      console.error('Error creating expense:', error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



  // async findAllExpenses(userId: string, startDate?: string, endDate?: string, filter?: string): Promise<Expense[]> {
  //   const whereClause: any = { user_id: userId };
  //   if (startDate && endDate) {
  //     whereClause.date = { $between: [startDate, endDate] };
  //   }
  //   if (filter) {
  //     whereClause.category = filter;
  //   }
  //   return this.expenseModel.findAll();
  // }

  //   async findAllExpenses(
  //     userId: string,
  //     startDate?: string,
  //     endDate?: string,
  //     filter?: string,
  // ): Promise<any[]> {
  //   console.log(userId, startDate, endDate, filter)
  //     const whereConditions: any = {
  //         user_id: userId,
  //     };

  //     // Add date range conditions if provided
  //     if (startDate && endDate) {
  //         whereConditions.date = {
  //             [Op.between]: [new Date(startDate), new Date(endDate)],
  //         };
  //     }
  // try{
  //     // Querying the expenses along with category join and filter
  //     const expenses = await this.expenseModel.findAll({
  //         where: whereConditions,
  //         include: [{
  //             model: Category,
  //             where: filter ? { name: filter } : {}, // Apply category filter if provided
  //             required: true, // Inner join
  //         }],
  //     });
  //     console.log(expenses);

  //     return expenses;}catch(err){
  //       console.log('error accured',err);
  //     }
  // }

  async findAllExpenses(
    userId: string,
    startDate?: string,
    endDate?: string,
    filter?: string,
    transactionType?: string,
    currency?: string,
    limit?: number,
    offset?: number
  ): Promise<any[]> {
    try {
      const expenses = await this.sequelize.query(`
  SELECT e.*, c.name AS category_name
  FROM expenses e
  LEFT JOIN categories c ON e.category_id = c.id
  WHERE e.user_id = :userId
  ${startDate && endDate ? 'AND e.date BETWEEN :startDate AND :endDate' : ''}
  ${filter ? 'AND c.name = :filter' : ''}
  ${currency ? 'AND e.currency = :currency' : ''}
  ${transactionType ? 'AND e.transaction_type = :transactionType' : ''}
`, {
        replacements: {
          userId,
          startDate,
          endDate,
          filter,
          currency,
          transactionType,
        },
        type: QueryTypes.SELECT,
      });


      console.log(expenses);
      return expenses;
    } catch (err) {
      console.log('Error occurred:', err);
      throw new HttpException(`Error: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR); // Consider throwing the error after logging
    }
  }


  async findExpenseById(userId: string, id: string): Promise<any> {
    try {
      const expense = await this.sequelize.query(`
      SELECT e.*, c.name AS category_name
      FROM expenses e
      LEFT JOIN categories c ON e.category_id = c.id
      WHERE e.user_id = :userId AND e.id = :id
    `, {
        replacements: { userId, id },
        type: QueryTypes.SELECT, // Use QueryTypes to define the type of query
      });

      console.log(expense);

      // Check if the expense exists and return it; otherwise, return null
      return expense.length > 0 ? expense[0] : null; // Assuming expense is an array
    } catch (err) {
      console.log('Error occurred:', err);
      throw new HttpException(`Error: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR); // Consider throwing the error after logging
    }
  }

  async updateExpense(userId: string, id: string, updateExpenseDto: UpdateExpenseDto): Promise<Expense | null> {
    const whereClause: any = {
      user_id: userId,
      id
    };

    const expense = await this.expenseModel.findOne({ where: whereClause });

    if (!expense) return null; // Expense not found

    // If category is updated, retrieve the new category ID
    if (updateExpenseDto.category) {
      updateExpenseDto.category = await this.getCategoryId(updateExpenseDto.category, userId);
    }

    // Update the expense with the new values
    return expense.update(updateExpenseDto); // This updates and returns the updated instance
  }


  async deleteExpense(userId: string, id: string): Promise<boolean> {
    const whereClause: any = {
      user_id: userId,
      id
    };
    const expense = await this.expenseModel.findOne({ where: whereClause });

    if (!expense) return false; // Expense not found

    await expense.destroy(); // Delete the expense
    return true; // Deletion was successful
  }


  async deleteExpensesByFileId(userId: string, fileId: string, options?: any): Promise<boolean> {
    const deletedCount = await this.expenseModel.destroy({
      where: { file_id: fileId, user_id: userId },
      ...options, // Pass options to support transactions
    });

    return deletedCount > 0; // Return true if any expenses were deleted
  }

  //new code for chart query
  // Method to get expenses grouped by date with offset and file_id
  async getExpensesGroupedByDateWithOffset(
    userId: string,
    offset: number = 0,
    file_id: string | null
  ): Promise<any[]> {
    // Calculate the limit based on the offset (1 offset = 7 days)
    const limit = 7;

    return await this.expenseModel.findAll({
      attributes: [
        [sequelize.literal('CONVERT(DATE, [date])'), 'date'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'total_amount'],
        'currency', // Include currency in the result set
        'transaction_type' // Include transaction_type in the result set
      ],
      where: {
        file_id: file_id, // Include file_id filter if provided
        user_id: userId
      },
      group: ['date', 'currency', 'transaction_type'], // Group by date, currency, and transaction_type
      order: [['date', 'ASC']], // Order by date in ascending order
      limit: limit, // Limit to the last 7 entries based on offset
      offset: offset * limit, // Apply offset in multiples of limit (7)
    });
  }



  // 2. Group by Category
  async getExpensesGroupedByCategory(
    userId: string,
    startDate: string | null,
    endDate: string | null,
    file_id: string | null
  ): Promise<any[]> {
    const start = startDate ? new Date(startDate).toISOString() : moment().subtract(7, 'days').toISOString();
    const end = endDate ? new Date(endDate).toISOString() : new Date().toISOString();

    const query = `
    SELECT c.name, SUM(expenses.amount) AS total_amount, currency, transaction_type
    FROM expenses
    LEFT JOIN categories c ON expenses.category_id = c.id
    WHERE (expenses.file_id = :file_id OR :file_id IS NULL) 
          AND expenses.user_id = :userId
          AND expenses.date BETWEEN :startDate AND :endDate
    GROUP BY c.name, currency, transaction_type;
 `;
 

    const replacements = {
      
      file_id,
      userId,
      startDate: start,
      endDate: end
    };

    try {
      const results = await this.sequelize.query(query, {
        replacements,
        type: QueryTypes.SELECT,
      });
      return results;
    } catch (error) {
      console.error('Error executing SQL query:', error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }





  // 3. Group by Week
  // Group expenses by category and transaction type
  async getExpensesGroupedByWeek(
    userId: string,
    month: number,
    year: number,
    file_id: string | null
  ): Promise<any[]> {
    console.log(year, month, file_id);
  
    const query = `
      SELECT 
        c.name AS category_name,
        e.transaction_type,
        e.currency,
        DATEPART(YEAR, e.date) AS [year], 
        DATEPART(MONTH, e.date) AS [month], 
        -- Calculate the week number in the month
        (DATEPART(DAY, e.date) - 1) / 7 + 1 AS [week], 
        SUM(e.amount) AS [total_amount]
      FROM 
        expenses e
      JOIN 
        categories c ON e.category_id = c.id
      WHERE 
        DATEPART(YEAR, e.date) = :year 
        AND DATEPART(MONTH, e.date) = :month 
        AND (e.file_id = :file_id OR :file_id IS NULL) 
        AND e.user_id = :userId
      GROUP BY 
        c.name,
        e.transaction_type,
        e.currency,
        DATEPART(YEAR, e.date), 
        DATEPART(MONTH, e.date), 
        (DATEPART(DAY, e.date) - 1) / 7 + 1
      ORDER BY 
        [week] ASC;
    `;
  
    const replacements = { month, year, file_id, userId };
  
    try {
      return await this.expenseModel.sequelize.query(query, {
        replacements: replacements,
        type: QueryTypes.SELECT,
      });
    } catch (error) {
      console.error('Error executing SQL query for grouping by category and transaction type:', error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  


  // 4. Group by Month
  // Group expenses by category and transaction type for the specified month and year
  async getExpensesGroupedByMonth(
    userId: string,
    year: number,
    file_id: string | null
  ): Promise<any[]> {
    console.log(year);
    const query = `
    SELECT 
      c.name AS category_name,
      e.transaction_type,
      DATEPART(YEAR, e.date) AS [year], 
      DATEPART(MONTH, e.date) AS [month], 
      SUM(e.amount) AS [total_amount]
    FROM 
      expenses e
    JOIN 
      categories c ON e.category_id = c.id
    WHERE 
      DATEPART(YEAR, e.date) = :year 
      AND (e.file_id = :file_id OR :file_id IS NULL) 
      AND e.user_id = :userId
    GROUP BY 
      c.name,
      e.transaction_type,
      DATEPART(YEAR, e.date), 
      DATEPART(MONTH, e.date)
    ORDER BY 
      c.name ASC, e.transaction_type ASC;
  `;

    const replacements = { year, file_id, userId };

    try {
      return await this.expenseModel.sequelize.query(query, {
        replacements: replacements,
        type: QueryTypes.SELECT,
      });
    } catch (error) {
      console.error('Error executing SQL query for grouping by category and transaction type:', error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  // 5. Group by Year
  // async getExpensesGroupedByYear(userId:string, file_id: string | null): Promise<any[]> {
  //   return await this.expenseModel.sequelize.query(`
  //     SELECT 
  //       DATEPART(YEAR, [date]) AS [year], 
  //       SUM([amount]) AS [total_amount]
  //     FROM [expenses]
  //     WHERE (file_id = :file_id OR :file_id IS NULL) AND user_id = :userId
  //     GROUP BY DATEPART(YEAR, [date])
  //     ORDER BY [year] ASC;
  //   `, {
  //     replacements: { file_id, userId },
  //     type: QueryTypes.SELECT,
  //   });
  // }
}