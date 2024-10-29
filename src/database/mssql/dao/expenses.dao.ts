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
import { TryCatchBlock } from 'src/common/tryCatchBlock';
import { ResponseMessages } from 'src/common/messages';
import { handleResponse, ResponseSchema } from 'src/common/handleResponse';
//import { GlobalExceptionFilter } from 'src/logger/globalExeption.filter';
import { response } from 'express';
import { CreateCategoryDto } from 'src/modules/categories/DTO/createCategory.dto';

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
    private sequelize: Sequelize,
    //private readonly globalExceptionFilter: GlobalExceptionFilter // Inject GlobalExceptionFilter


  ) { }

  private async getCategoryId(category: string, userId: string): Promise<ResponseSchema> {
    return TryCatchBlock(async () => {
      const categoryResult: any = await this.categoryDao.getCategoryByName(category, userId);
      if (!categoryResult.response) {
        return ({ status: HttpStatus.NOT_FOUND, message: ResponseMessages.CNot });
      }

      return ({ status: HttpStatus.OK, message: ResponseMessages.CG, response: categoryResult.response.id });
    })
  }

  // async createExpense(
  //   createExpenseDto: CreateExpenseDto,
  //   userId: string,
  //   options?: any
  // ): Promise<ResponseSchema> {

  //   return TryCatchBlock(async () => {
  //     const { name, amount, date, category, description, transaction_type, currency, file_id } = createExpenseDto;
  //     const updatedFullDate = new Date(date).toISOString();
  //     let data = await this.getCategoryId(category, userId);
  //     console.log("gggggg",data);
  //     if (!data.response) {
  //       return handleResponse({ message: ResponseMessages.CNot, status: HttpStatus.NOT_FOUND });
  //     }
  //     createExpenseDto.category = data.response 
  //     // Check for existing expense with the same name, amount, date, and category
  //     const existingExpense = await this.expenseModel.findOne({
  //       where: {
  //         name,
  //         category_id: createExpenseDto.category,
  //         date: updatedFullDate,
  //         user_id: userId,
  //         transaction_type: transaction_type,
  //         currency: currency
  //       },
  //     });

  //     if (existingExpense) {
  //       return handleResponse({ message: ResponseMessages.EExist, status: HttpStatus.CONFLICT });
  //     }

  //     const createExpenseData = {
  //       user_id: userId,
  //       name,
  //       category_id: createExpenseDto.category,
  //       transaction_type,
  //       amount: Number(amount),
  //       date: updatedFullDate,
  //       currency,
  //       description,
  //       file_id
  //     };

  //     let response = await this.expenseModel.create(createExpenseData, options);
  //     return handleResponse({ status: HttpStatus.OK, message: ResponseMessages.PS, response })
  //   })
  // }

  //cloud ai code started
  async createExpense(
    createExpenseDto: CreateExpenseDto,
    userId: string,
    options?: any
): Promise<ResponseSchema> {
    return TryCatchBlock(async () => {
      const { name, amount, date, category, description, transaction_type, currency, file_id } = createExpenseDto;
      const updatedFullDate = new Date(date).toISOString();
      
      const categoryData = await this.getCategoryId(category, userId);
      console.log("Category data:", categoryData);
      
      if (!categoryData.response) {
        return handleResponse({ message: ResponseMessages.CNot, status: HttpStatus.NOT_FOUND });
      }

      const categoryId = categoryData.response;
      
      // Check for existing expense
      const existingExpense = await this.expenseModel.findOne({
        where: {
          name,
          category_id: categoryId,
          date: updatedFullDate,
          user_id: userId,
          transaction_type,
          currency
        },
        transaction: options?.transaction
      });

      if (existingExpense) {
        return handleResponse({ message: ResponseMessages.EExist, status: HttpStatus.CONFLICT });
      }

      const createExpenseData = {
        user_id: userId,
        name,
        category_id: categoryId,
        transaction_type,
        amount: Number(amount),
        date: updatedFullDate,
        currency,
        description,
        file_id
      };

      const response = await this.expenseModel.create(createExpenseData, options);
      return handleResponse({ status: HttpStatus.OK, message: ResponseMessages.PS, response });
    });
}
//end of claud ai code


  async findAllExpenses(
    userId: string,
    startDate?: string,
    endDate?: string,
    filter?: string,
    transactionType?: string,
    currency?: string,
    limit?: number,
    offset?: number
  ): Promise<ResponseSchema> {
    return TryCatchBlock(async () => {
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
      return handleResponse({ status: HttpStatus.OK, message: ResponseMessages.GS, response: expenses });
    })
  }


  async findExpenseById(userId: string, id: string): Promise<any> {
    return TryCatchBlock(async () => {
      const expense = await this.sequelize.query(`
      SELECT e.*, c.name AS category_name
      FROM expenses e
      LEFT JOIN categories c ON e.category_id = c.id
      WHERE e.user_id = :userId AND e.id = :id
    `, {
        replacements: { userId, id },
        type: QueryTypes.SELECT, // Use QueryTypes to define the type of query
      });

      if (!expense) {
        return handleResponse({ status: HttpStatus.NOT_FOUND, message: ResponseMessages.CNot })
      }

      // Check if the expense exists and return it; otherwise, return null
      //return expense.length > 0 ? expense[0] : null;
      return handleResponse({ status: HttpStatus.OK, message: ResponseMessages.GS, response: expense });
    })
  }

  async updateExpense(userId: string, id: string, updateExpenseDto: UpdateExpenseDto): Promise<ResponseSchema> {
    return TryCatchBlock(async () => {
      const whereClause: any = {
        user_id: userId,
        id
      };
      console.log(updateExpenseDto);
      console.log(updateExpenseDto.category);

      const expense = await this.expenseModel.findOne({ where: whereClause });
      console.log(expense);
      if (!expense) return handleResponse({ status: HttpStatus.NOT_FOUND, message: ResponseMessages.DataNot }); // Expense not found

      // If category is updated, retrieve the new category ID
      if (updateExpenseDto.category !== undefined) {
        let category_id_result = await this.getCategoryId(updateExpenseDto.category, userId);
        console.log(category_id_result, 'from the expenses update');
        if (category_id_result.status != 200) {
          return category_id_result;
        }
        console.log('category', category_id_result.response);
        updateExpenseDto.category = category_id_result.response;
      }

      // Update the expense with the new values
      let response = await expense.update(updateExpenseDto);
      return handleResponse({ status: HttpStatus.OK, message: ResponseMessages.PutS, response })
    }) // This updates and returns the updated instance
  }


  async deleteExpense(userId: string, id: string): Promise<ResponseSchema> {
    return TryCatchBlock(async () => {
      const whereClause: any = {
        user_id: userId,
        id
      };
      const expense = await this.expenseModel.findOne({ where: whereClause });

      if (!expense) return handleResponse({ status: HttpStatus.NOT_FOUND, message: ResponseMessages.DataNot }); // Expense not found

      await expense.destroy(); // Delete the expense
      return handleResponse({ status: HttpStatus.OK, message: ResponseMessages.DS });
    })
  }


  async deleteExpensesByFileId(userId: string, fileId: string, options?: any): Promise<ResponseSchema> {
    return TryCatchBlock(async () => {
      const deletedCount = await this.expenseModel.destroy({
        where: { file_id: fileId, user_id: userId },
        ...options
      });

      return handleResponse({ status: HttpStatus.OK, message: ResponseMessages.DS , response :deletedCount});
    })
  }

  //new code for chart query
  // Method to get expenses grouped by date with offset and file_id
  async getExpensesGroupedByDateWithOffset(
    userId: string,
    offset: number = 0,
    file_id: string | null
  ): Promise<ResponseSchema> {
    return TryCatchBlock(async () => {
      const limit = 7;

      let data = await this.expenseModel.findAll({
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

      return handleResponse({ status: HttpStatus.OK, message: ResponseMessages.GS, response: data })
    })

  }



  // 2. Group by Category
  async getExpensesGroupedByCategory(
    userId: string,
    startDate: string | null,
    endDate: string | null,
    file_id: string | null
  ): Promise<ResponseSchema> {
    return TryCatchBlock(async () => {
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


      const results = await this.sequelize.query(query, {
        replacements,
        type: QueryTypes.SELECT,
      });
      return handleResponse({ status: HttpStatus.OK, message: ResponseMessages.GS, response: results });
    })
  }





  // 3. Group by Week
  // Group expenses by category and transaction type
  async getExpensesGroupedByWeek(
    userId: string,
    month: number,
    year: number,
    file_id: string | null
  ): Promise<ResponseSchema> {
    return TryCatchBlock(async () => {
      console.log(year, month, file_id,"parameters");

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


      let result = await this.expenseModel.sequelize.query(query, {
        replacements: replacements,
        type: QueryTypes.SELECT,
      });
      console.log(result);
      return handleResponse({ status: HttpStatus.OK, response: result, message: ResponseMessages.GS });
    })

  }



  // 4. Group by Month
  // Group expenses by category and transaction type for the specified month and year
  async getExpensesGroupedByMonth(
    userId: string,
    year: number,
    file_id: string | null
  ): Promise<ResponseSchema> {
    return TryCatchBlock(async () => {
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


      let data = await this.expenseModel.sequelize.query(query, {
        replacements: replacements,
        type: QueryTypes.SELECT,
      });
      return handleResponse({ status: HttpStatus.OK, response: data, message: ResponseMessages.GS });
    })
  }
}