import { Injectable, HttpException, HttpStatus, Inject, Query } from '@nestjs/common';
import { ExpenseTag } from '../models/expenseTags.models';// Adjust the import path as needed
import { CreateExpenseTagDto } from 'src/modules/expenseTags/DTO/createExpenseTag.dto';
import { Sequelize, Sequelize as sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';
import { userInfo } from 'os';
import { TryCatchBlock } from 'src/common/tryCatchBlock';
import { handleResponse, ResponseSchema } from 'src/common/handleResponse';
import { ResponseMessages } from 'src/common/messages';


@Injectable()
export class ExpenseTagDao {
  constructor(
    @Inject(Sequelize)
    private sequelize: Sequelize
  ) { }
  async createTag(expenseTagData: CreateExpenseTagDto, user_id: string, expenseId: string): Promise<ResponseSchema> {
    return TryCatchBlock(async () => {
      const expenseDataResult = {
        user_id: user_id,
        expense_id: expenseId,
        tag_name: expenseTagData.tag_name,
      };

      const expenseDetails = await this.sequelize.query(`SELECT * FROM expenses 
                              WHERE id=:expenseId`, {
        replacements: {
          expenseId
        },
        type: QueryTypes.SELECT
      })
      if (expenseDetails.length == 0) {
        return handleResponse({ status: HttpStatus.NOT_FOUND, message: ResponseMessages.ENExist })
      }

      // Prepare the SQL query to check for existing tags
      const expenseDataQuery = `
                                SELECT * FROM expense_tags 
                                WHERE user_id = :userId
                                AND expense_id = :expenseId
                                OR tag_name = :tagName;
                                `;

      // Execute the query
      const [result] = await this.sequelize.query(expenseDataQuery, {
        replacements: {
          userId: user_id,
          expenseId,
          tagName: expenseDataResult.tag_name,
        },
        type: QueryTypes.SELECT,
      });

      // If a tag already exists, throw an exception
      if (result) {
        return handleResponse({ status: HttpStatus.CONFLICT, message: ResponseMessages.DExist });
      }

      // Create a new ExpenseTag entry
      let response = await ExpenseTag.create(expenseDataResult);

      return handleResponse({ status: HttpStatus.OK, message: ResponseMessages.PS, response })
    })
  }

  async getTagsByExpenseId(expenseId: string, userId: string): Promise<ResponseSchema> {
    return TryCatchBlock(async () => {
      const tags = await ExpenseTag.findAll({
        where: {
          expense_id: expenseId,
          user_id: userId,
        },
      });

      // if (!tags.length) {
      //   return handleResponse({message:ResponseMessages.,status:HttpStatus.NOT_FOUND});
      // }

      return handleResponse({ message: ResponseMessages.GS, status: HttpStatus.OK, response: tags });
    })
  }

  async getTagsByExpense(userId: string): Promise<ResponseSchema> {
    return TryCatchBlock(async () => {
      const query = `
      SELECT et.id as expense_tag_id, e.id as expense_id, et.*, e.*
      FROM expense_tags et
      LEFT JOIN expenses e ON e.id = et.expense_id 
      WHERE et.user_id = :userId;
    `;

    // const query = `
    // SELECT * FROM expenses`

      // Execute the raw SQL query
      const response = await this.sequelize.query(query, {
      replacements: { userId },  // Safely pass the userId into the query
        type: QueryTypes.SELECT, // Ensure we are selecting data
      });

      return handleResponse({ status: HttpStatus.OK, message: ResponseMessages.GS, response });
    })
  }

  async updateTag(id: string, updateData: Partial<ExpenseTag>, userId: string): Promise<ResponseSchema> {
    return TryCatchBlock(async () => {
      const tag = await ExpenseTag.findOne({ where: { id, user_id: userId } });

      if (!tag) {
        return handleResponse({ message: ResponseMessages.DataNot, status: HttpStatus.NOT_FOUND });
      }

      let response = await tag.update(updateData);
      return handleResponse({ status: HttpStatus.OK, message: ResponseMessages.PutS, response })
    })
  }

  async deleteTag(id: string, userId: string): Promise<ResponseSchema> {
    return TryCatchBlock(async () => {
      const tag = await ExpenseTag.findOne({ where: { id, user_id: userId } });
      console.log(!tag);
      if (!tag) {
        console.log('called');
        return handleResponse({status:HttpStatus.NOT_FOUND,message:ResponseMessages.DataNot})  
      }

      let response = await tag.destroy();
      return handleResponse({ message: ResponseMessages.DataNot, status: HttpStatus.OK, response });
    })
  }

}
