import { Injectable, HttpException, HttpStatus } from "@nestjs/common"; // Import HttpException and HttpStatus
import { ResponseSchema } from "src/common/handleResponse";
import { CategoryDao } from "src/database/mssql/dao/category.dao";
import { Category } from "src/database/mssql/models/category.models";

@Injectable()
export class CategoryService {
  constructor(private readonly categoryDao: CategoryDao) {}

  async createCategory(categoryData: Partial<Category>, role: string): Promise<ResponseSchema> {
    let data =  await this.categoryDao.createCategory(categoryData, role);
    return data;
  }

  async deleteCategory(id: string, userId: string): Promise<ResponseSchema> {
     return await this.categoryDao.deleteCategory(id, userId);
  }

  async getAllCategories(userId: string, name?: string): Promise<ResponseSchema> {
     return await this.categoryDao.getAllCategories(userId, name);
  }

  async getUSerExpenses(userId:string,name?:string):Promise<ResponseSchema>{
    return await this.categoryDao.getUserCategories(userId,name);
  }

  async updateCategory(id: string, categoryData: Partial<Category>, userId: string): Promise<ResponseSchema> {
    const category = await this.categoryDao.updateCategory(id, categoryData, userId);
    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    return category;
  }
}
