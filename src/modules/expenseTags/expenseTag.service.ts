import { Injectable } from '@nestjs/common';
import { ExpenseTagDao } from 'src/database/mssql/dao/expenseTags.dao'; // Adjust the import path as needed
import { CreateExpenseTagDto } from './DTO/createExpenseTag.dto'; // Adjust the import path as needed
import { ExpenseTag } from 'src/database/mssql/models/expenseTags.models';
import { ResponseSchema } from 'src/common/handleResponse';
import { QueryExpenseTagDto } from './DTO/queryExpenseTag.dto';
import { AbstractExpenseTagDao } from 'src/database/mssql/abstract/expenseTagDao.abstract';
import { DatabaseService } from 'src/database/database.service';
import { AbstractExpenseTag } from './expenseTag.abstract';

@Injectable()
export class ExpenseTagService implements AbstractExpenseTag{
  private readonly _tagTxn: AbstractExpenseTagDao
  constructor(private readonly _dbSvc :DatabaseService) {
    this._tagTxn = this._dbSvc.expenseTagSqlTxn;
  }

  async createExpenseTag(expenseTagDto:CreateExpenseTagDto, userId: string, expenseId: string): Promise<ResponseSchema> {
    return await this._tagTxn.createTag(expenseTagDto, userId, expenseId );
  }

  async getTagsForExpense(expenseId: string, userId: string): Promise<ResponseSchema> {
    return await this._tagTxn.getTagsByExpenseId(expenseId, userId);
  }
  async getALLTagsForExpense(userId: string, param:QueryExpenseTagDto): Promise<ResponseSchema> {
    return await this._tagTxn.getTagsByExpense(userId,param);
  }

  async updateExpenseTag(id: string, updateExpenseTagDto: CreateExpenseTagDto, userId: string): Promise<ResponseSchema> {
    return await this._tagTxn.updateTag(id, updateExpenseTagDto, userId);
  }

  async deleteExpenseTag(id: string, userId: string): Promise<ResponseSchema> {
    return await this._tagTxn.deleteTag(id, userId);
  }

  async getExpensesTagSize(userId:string):Promise<ResponseSchema>{
    return await this._tagTxn.getTagsSize(userId);
  }
}
