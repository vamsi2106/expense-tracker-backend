import { Injectable, HttpException, HttpStatus, Inject, Query } from '@nestjs/common';
import { ExpenseTag } from '../models/expenseTags.models';// Adjust the import path as needed
import { CreateExpenseTagDto } from 'src/modules/expenseTags/DTO/createExpenseTag.dto';
import { Sequelize, Sequelize as sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';
import { userInfo } from 'os';


@Injectable()
export class ExpenseTagDao {
constructor(
  @Inject(Sequelize)
  private sequelize:Sequelize
){}
async createTag(expenseTagData: CreateExpenseTagDto, user_id: string, expenseId: string): Promise<ExpenseTag> {
  try {
    const expenseDataResult = {
      user_id: user_id,
      expense_id: expenseId,
      tag_name: expenseTagData.tag_name,
    };

    // Prepare the SQL query to check for existing tags
    const expenseDataQuery = `
      SELECT * FROM expense_tags 
      WHERE expense_id = :expenseId 
      AND user_id = :userId 
      AND tag_name = :tagName;
    `;

    // Execute the query
    const [result] = await this.sequelize.query(expenseDataQuery, {
      replacements: {
        expenseId,
        userId: user_id,
        tagName: expenseDataResult.tag_name,
      },
      type: QueryTypes.SELECT,
    });

    // If a tag already exists, throw an exception
    if (result) {
      throw new HttpException('Tag already exists for this expense', HttpStatus.CONFLICT);
    }

    // Create a new ExpenseTag entry
    return await ExpenseTag.create(expenseDataResult);
  } catch (error) {
    // Log the error and throw an internal server error
    console.error('Error creating tag:', error);
    throw new HttpException(error.response, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

  async getTagsByExpenseId(expenseId: string, userId: string): Promise<ExpenseTag[]> {
    const tags = await ExpenseTag.findAll({
      where: {
        expense_id: expenseId,
        user_id: userId,
      },
    });

    if (!tags.length) {
      throw new HttpException('No tags found for this expense', HttpStatus.NOT_FOUND);
    }

    return tags;
  }
  async getTagsByExpense(userId: string): Promise<any> {
    try{
      const query = `
      SELECT et.*, e.*
      FROM expense_tags et
      LEFT JOIN expenses e ON e.id = et.expense_id 
      WHERE et.user_id = :userId;
    `;

    // Execute the raw SQL query
    const [results, metadata] = await this.sequelize.query(query, {
      replacements: { userId },  // Safely pass the userId into the query
      type: QueryTypes.SELECT, // Ensure we are selecting data
    });

    console.log(results);  // Log the results for debugging
    return results;}
    catch(error){
      console.log(error);
      return (error);
    }        // Return the results
  }
  async updateTag(id: string, updateData: Partial<ExpenseTag>, userId: string): Promise<ExpenseTag> {
    const tag = await ExpenseTag.findOne({ where: { id, user_id: userId } });

    if (!tag) {
      throw new HttpException('Tag not found', HttpStatus.NOT_FOUND);
    }

    return tag.update(updateData);
  }

  async deleteTag(id: string, userId: string): Promise<void> {
    const tag = await ExpenseTag.findOne({ where: { id, user_id: userId } });

    if (!tag) {
      throw new HttpException('Tag not found', HttpStatus.NOT_FOUND);
    }

    await tag.destroy();
  }
}
