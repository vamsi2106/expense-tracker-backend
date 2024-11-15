import { ResponseSchema } from "src/common/handleResponse";
import { Category } from "src/database/mssql/models/category.models";
import { queryCategory } from "./DTO/queryCategory.dto";

export abstract class AbstractCategory{
    abstract createCategory(categoryData: Partial<Category>, role: string): Promise<ResponseSchema>
    abstract deleteCategory(id: string, userId: string): Promise<ResponseSchema>;
    abstract getAllCategories(userId: string, params:queryCategory): Promise<ResponseSchema>;
    abstract getUserCategories(userId:string,params:queryCategory):Promise<ResponseSchema>;
    abstract updateCategory(id: string, categoryData: Partial<Category>, userId: string): Promise<ResponseSchema>;
}