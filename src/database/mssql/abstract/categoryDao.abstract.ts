import { ResponseSchema } from "src/common/handleResponse";
import { Category } from "../models/category.models";
import { queryCategory } from "src/modules/categories/DTO/queryCategory.dto";

export abstract class AbstractCategoryDao{
    abstract createCategory(categoryData: Partial<Category>, role: string): Promise<ResponseSchema>;
    abstract deleteCategory(id: string, userId: string): Promise<ResponseSchema>;
    abstract getCategoryByName(name: string, userId: string): Promise<ResponseSchema>;
    abstract getCategoryById(id: string): Promise<ResponseSchema>;
    abstract getAllCategories(userId: string, params:queryCategory): Promise<ResponseSchema>;
    abstract getUserCategories(userId: string, params:queryCategory): Promise<ResponseSchema>;
    abstract updateCategory(id: string, categoryData: Partial<Category>, userId: string): Promise<ResponseSchema>;
    abstract getCategorySize(user_id):Promise<ResponseSchema>
}