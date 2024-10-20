import { Injectable, HttpException, HttpStatus } from "@nestjs/common"; // Import HttpException and HttpStatus
import { CategoryDao } from "src/database/mssql/dao/category.dao";
import { Category } from "src/database/mssql/models/category.models";

@Injectable()
export class CategoryService {
  constructor(private readonly categoryDao: CategoryDao) {}

  async createCategory(categoryData: Partial<Category>, role: string): Promise<Category> {
    return await this.categoryDao.createCategory(categoryData, role);
  }

  async deleteCategory(id: string, userId: string): Promise<void> {
    const category = await this.categoryDao.getCategoryById(id);
    
    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    
    if (category.default_category) {
      throw new HttpException('Default categories cannot be deleted.', HttpStatus.FORBIDDEN);
    }

    // Ensure the category belongs to the user if needed
    // Example: if (category.user_id !== userId) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    await this.categoryDao.deleteCategory(id, userId);
  }

  async getCategoryByName(name: string, userId: string): Promise<Category | null> {
    const category = await this.categoryDao.getCategoryByName(name, userId);
    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    return category;
  }

  async getAllCategories(userId: string, filter?: string): Promise<Category[]> {
    // Call getAllCategories from DAO with filter parameters if needed
    return await this.categoryDao.getAllCategories(userId, filter);
  }

  async updateCategory(id: string, categoryData: Partial<Category>, userId: string): Promise<Category> {
    const category = await this.categoryDao.updateCategory(id, categoryData, userId);
    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    return category;
  }
}
