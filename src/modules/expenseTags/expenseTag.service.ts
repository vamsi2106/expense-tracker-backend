import { Injectable } from '@nestjs/common';
import { ExpenseTagDao } from 'src/database/mssql/dao/expenseTags.dao'; // Adjust the import path as needed
import { CreateExpenseTagDto } from './DTO/createExpenseTag.dto'; // Adjust the import path as needed
import { ExpenseTag } from 'src/database/mssql/models/expenseTags.models';

@Injectable()
export class ExpenseTagService {
  constructor(private readonly expenseTagDao: ExpenseTagDao) {}

  async createExpenseTag(expenseTagDto:CreateExpenseTagDto, userId: string, expenseId: string): Promise<ExpenseTag> {
    return this.expenseTagDao.createTag(expenseTagDto, userId, expenseId );
  }

  async getTagsForExpense(expenseId: string, userId: string): Promise<ExpenseTag[]> {
    return this.expenseTagDao.getTagsByExpenseId(expenseId, userId);
  }
  async getALLTagsForExpense(userId: string): Promise<ExpenseTag[]> {
    return this.expenseTagDao.getTagsByExpense(userId);
  }

  async updateExpenseTag(id: string, updateExpenseTagDto: CreateExpenseTagDto, userId: string): Promise<ExpenseTag> {
    return this.expenseTagDao.updateTag(id, updateExpenseTagDto, userId);
  }

  async deleteExpenseTag(id: string, userId: string): Promise<void> {
    return this.expenseTagDao.deleteTag(id, userId);
  }
}
