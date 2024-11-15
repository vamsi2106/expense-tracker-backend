import { Inject, Injectable } from '@nestjs/common';
import { currencyTypes, Expense } from '../models/expenses.models';
import { CreateExpenseDto } from 'src/modules/expenses/dto/create-expense.dto';
import { UpdateExpenseDto } from 'src/modules/expenses/dto/update-expense.dto';
import { HttpStatus } from '@nestjs/common';
import * as moment from 'moment';
import { Sequelize, Sequelize as sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';
import { TryCatchBlock } from 'src/common/tryCatchBlock';
import { ResponseMessages } from 'src/common/messages';
import { handleResponse, ResponseSchema } from 'src/common/handleResponse';
import { ExpenseQueryDto } from 'src/modules/expenses/DTO/expenseQuery.dto';
import { AbstractExpenseDao } from '../abstract/expenseDao.abstract';
import { msSqlConstants } from '../connection/constants.mssql';
import { AbstractCategoryDao } from '../abstract/categoryDao.abstract';

@Injectable()
export class ExpenseDao implements AbstractExpenseDao {
  constructor(
    @Inject(msSqlConstants.Expense)  // Sequelize model injection
    private readonly expenseModel: typeof Expense,  // Ensure this matches
    // @Inject(CategoryDao)
    private readonly categoryDao: AbstractCategoryDao,
    @Inject(msSqlConstants.SequelizeProvider) // Use the Sequelize injection here
    private sequelize: Sequelize,
  ) { }

  async getCategoryId(category: string, userId: string): Promise<ResponseSchema> {
    return TryCatchBlock(async () => {
      const categoryResult: any = await this.categoryDao.getCategoryByName(category, userId);
      if (!categoryResult.response) {
        return ({ status: HttpStatus.NOT_FOUND, message: ResponseMessages.CNot });
      }

      return ({ status: HttpStatus.OK, message: ResponseMessages.CG, response: categoryResult.response.id });
    })
  }

  async createExpense(
    createExpenseDto: CreateExpenseDto,
    userId: string,
    options?: any
  ): Promise<ResponseSchema> {
    return TryCatchBlock(async () => {
      const { name, amount, date, category, description, transaction_type, currency, file_id } = createExpenseDto;
      const updatedFullDate = new Date(date).toISOString();

      const categoryData = await this.getCategoryId(category, userId);
    
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

  async addRecurringExpence(newDate:any,expense_id: string): Promise<any> {
    try {
      const sourceExpense = await this.expenseModel.findByPk(expense_id);
      if (!sourceExpense) {
        return (ResponseMessages.DataNot);
      }
      let expenseData = {
        name: sourceExpense.name,
        amount: sourceExpense.amount,
        date: newDate,
        category_id: sourceExpense.category_id,
        transaction_type: sourceExpense.transaction_type,
        currency: sourceExpense.currency,
        description: sourceExpense.description,
        user_id:sourceExpense.user_id
    }
      await this.expenseModel.create({ ...expenseData });
      return;
    } catch (err) {
      return err.message;
    }
  }

  async findAllExpenses(userId: string, query: ExpenseQueryDto): Promise<ResponseSchema> {
    return TryCatchBlock(async () => {
      let {
        name,
        start_date,
        end_date,
        category,
        transaction_type,
        currency,
        limit,
        offset,
        min_price,
        max_price,
      } = query;

      let currencyValues = null;
      let transactionTypeValues = null;
      let categoryValues = null;

      // Split and validate currency values
      if (currency) {
        currencyValues = currency.split(',');
        // Check if there are any invalid currency types
        if (!currencyValues.every(item => currencyTypes.includes(item))) {
          return handleResponse({ status: HttpStatus.BAD_REQUEST, message: ResponseMessages.BR });
        }
      }

      // Split and validate transaction type values
      if (transaction_type) {
        transactionTypeValues = transaction_type.split(',');
        // Check if there are any invalid transaction types
        if (!transactionTypeValues.every(item => ['expense', 'income'].includes(item))) {
          return handleResponse({ status: HttpStatus.BAD_REQUEST, message: ResponseMessages.BR });
        }
      }

      // Split category values
      if (category) {
        categoryValues = category.split(',');
      }

      // Execute the SQL query
      const expenses = await this.sequelize.query(
        `
          SELECT e.*, c.name AS category_name
          FROM expenses e
          LEFT JOIN categories c ON e.category_id = c.id
          WHERE e.user_id = :userId
          ${name ? 'AND e.name LIKE :name' : ''}
          ${start_date ? 'AND e.date >= :start_date' : ''}
          ${end_date ? 'AND e.date <= :end_date' : ''}
          ${categoryValues && categoryValues.length > 0 ? 'AND c.name IN (:categoryValues)' : ''}
          ${transactionTypeValues && transactionTypeValues.length > 0 ? 'AND e.transaction_type IN (:transactionTypeValues)' : ''}
          ${currencyValues && currencyValues.length > 0 ? 'AND e.currency IN (:currencyValues)' : ''}
          ${typeof min_price !== 'undefined' ? 'AND e.amount >= :min_price' : ''}
          ${typeof max_price !== 'undefined' ? 'AND e.amount <= :max_price' : ''}
          ORDER BY e.date DESC
          OFFSET :offset ROWS
          FETCH NEXT :limit ROWS ONLY
        `,
        {
          replacements: {
            userId,
            name: name ? `%${name}%` : undefined,
            start_date,
            end_date,
            categoryValues,
            transactionTypeValues,
            currencyValues,
            min_price,
            max_price,
            limit: Number(limit) || 50,
            offset: Number(offset) || 0,
          },
          type: QueryTypes.SELECT,
        }
      );

      const size = await this.expenseModel.count({where :{user_id:userId}})

      return handleResponse({ status: HttpStatus.OK, message: ResponseMessages.GS, response: expenses, size });
    });
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

     return handleResponse({ status: HttpStatus.OK, message: ResponseMessages.GS, response: expense });
    })
  }

  async updateExpense(userId: string, id: string, updateExpenseDto: UpdateExpenseDto): Promise<ResponseSchema> {
    return TryCatchBlock(async () => {
      const whereClause: any = {
        user_id: userId,
        id
      };
    
      const expense = await this.expenseModel.findOne({ where: whereClause });
      if (!expense) return handleResponse({ status: HttpStatus.NOT_FOUND, message: ResponseMessages.DataNot }); // Expense not found

      // If category is updated, retrieve the new category ID
      if (updateExpenseDto.category !== undefined) {
        let category_id_result = await this.getCategoryId(updateExpenseDto.category, userId);
       if (category_id_result.status != 200) {
          return category_id_result;
        }
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

      return handleResponse({ status: HttpStatus.OK, message: ResponseMessages.DS, response: deletedCount });
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
        WHERE 
              expenses.user_id = :userId
              AND expenses.date BETWEEN :startDate AND :endDate
               ${file_id ? 'AND file_id = :file_id' : ''}
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

  async getTotalLength(user_id): Promise<ResponseSchema> {
    return TryCatchBlock(async () => {
      let response = await this.expenseModel.count({
        where: { user_id }
      });
      return handleResponse({ status: HttpStatus.OK, message: ResponseMessages.GS, response: { size: response } })
    })
  }
}