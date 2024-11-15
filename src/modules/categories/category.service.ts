import { Injectable, HttpException, HttpStatus } from "@nestjs/common"; // Import HttpException and HttpStatus
import { ResponseSchema } from "src/common/handleResponse";
import { Category } from "src/database/mssql/models/category.models";
import { queryCategory } from "./DTO/queryCategory.dto";
import { DatabaseService } from "src/database/database.service";
import { AbstractCategory } from "./category.abstract";
import { AbstractCategoryDao } from "src/database/mssql/abstract/categoryDao.abstract";

@Injectable()
export class CategoryService implements AbstractCategory{
  private readonly _categoryTxn: AbstractCategoryDao
  constructor(private readonly _dbSvc:DatabaseService) {
    this._categoryTxn=_dbSvc.categorySqlTxn;
  }

  async createCategory(categoryData: Partial<Category>, role: string): Promise<ResponseSchema> {
    let data =  await this._categoryTxn.createCategory(categoryData, role);
    return data;
  }

  async deleteCategory(id: string, userId: string): Promise<ResponseSchema> {
     return await this._categoryTxn.deleteCategory(id, userId);
  }

  async getAllCategories(userId: string, params:queryCategory): Promise<ResponseSchema> {
     return await this._categoryTxn.getAllCategories(userId, params);
  }

  async getUserCategories(userId:string,params:queryCategory):Promise<ResponseSchema>{
    return await this._categoryTxn.getUserCategories(userId,params);
  }

  async updateCategory(id: string, categoryData: Partial<Category>, userId: string): Promise<ResponseSchema> {
    return await this._categoryTxn.updateCategory(id, categoryData, userId);
  }
}
