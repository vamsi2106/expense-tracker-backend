import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ExpenseTag } from '../models/expenseTags.models';// Adjust the import path as needed
import { CreateExpenseTagDto } from 'src/modules/expenseTags/DTO/createExpenseTag.dto';

@Injectable()
export class ExpenseTagDao {
  async createTag(expenseTagData : CreateExpenseTagDto,user_id:string,expenseId:string): Promise<ExpenseTag> {
    
    let expenseData = {
      user_id : user_id,
      expense_id : expenseId,
      tag_name: expenseTagData.tag_name

    }
    return ExpenseTag.create(expenseData);
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
  async getTagsByExpense(userId: string): Promise<ExpenseTag[]> {
    const tags = await ExpenseTag.findAll({
      where: {
        user_id: userId,
      },
    });
    console.log(tags);
    return tags;
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
