import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Category } from '../models/category.models'; // Adjust the import path as needed
import { Op } from 'sequelize';
import { handleResponse, ResponseSchema } from 'src/common/handleResponse';
import { ResponseMessages } from 'src/common/messages';
import { TryCatchBlock } from 'src/common/tryCatchBlock';

@Injectable()
export class CategoryDao {

    async createCategory(categoryData: Partial<Category>, role: string): Promise<ResponseSchema> {
        return TryCatchBlock(async () => {
            const existingCategory = await Category.findOne({
                where: {
                    [Op.or]: [
                        {
                            name: categoryData.name,
                            type: categoryData.type,
                            user_id: categoryData.user_id,
                        },
                        {
                            name: categoryData.name,
                            type: categoryData.type,
                            default_category: true,
                        }
                    ],
                },
            });

            if (role === 'user') {
                categoryData.default_category = false;
            } else {
                categoryData.default_category = true;
            }

            // If a category already exists
            if (existingCategory) {
                return handleResponse({ status: HttpStatus.CONFLICT, message: ResponseMessages.CExist });
            }

            const data = await Category.create(categoryData);
            return handleResponse({ status: HttpStatus.OK, message: ResponseMessages.CP, response: data });
        });
    }

    async deleteCategory(id: string, userId: string): Promise<ResponseSchema> {
        return TryCatchBlock(async () => {
            const category = await Category.findOne({ where: { id, user_id: userId } });
            console.log(!category);
            if (!category) {
                return handleResponse({ status: HttpStatus.NOT_FOUND, message: ResponseMessages.CNot });
            }

            await category.destroy();
            return handleResponse({ status: HttpStatus.OK, message: ResponseMessages.CD });
        });
    }

    async getCategoryByName(name: string, userId: string): Promise<ResponseSchema> {
        return TryCatchBlock(async () => {
            const category = await Category.findOne({
                where: {
                    [Op.or]: [
                        { name, user_id: userId },
                        { name, default_category: true }
                    ]
                }
            })

            if (!category) {
                return handleResponse({ status: HttpStatus.NOT_FOUND, message: ResponseMessages.CNot });
            }

            return handleResponse({ status: HttpStatus.OK, message: ResponseMessages.CG, response: category });
        });
    }

    async getCategoryById(id: string): Promise<ResponseSchema> {
        return TryCatchBlock(async () => {
            const category = await Category.findOne({ where: { id } });

            if (!category) {
                return handleResponse({ status: HttpStatus.NOT_FOUND, message: ResponseMessages.CNot });
            }

            return handleResponse({ status: HttpStatus.OK, message: ResponseMessages.CG, response: category });
        });
    }

    async getAllCategories(userId: string, name?: string): Promise<ResponseSchema> {
        return TryCatchBlock(async () => {
            const whereClause: any = [
                { user_id: userId },
                { default_category: true }
            ];

            if (name) {
                whereClause[0].name = name;
            }

            const categories = await Category.findAll({
                where: {
                    [Op.or]: whereClause
                }
            });

            return handleResponse({ status: HttpStatus.OK, message: ResponseMessages.CG, response: categories });
        });
    }

    async getUserCategories(userId: string, name?: string): Promise<ResponseSchema> {
        return TryCatchBlock(async () => {
            const whereClause: any = [{ user_id: userId }];

            if (name) {
                whereClause[0].name = name;
            }

            const categories = await Category.findAll({
                where: {
                    [Op.or]: whereClause
                }
            });

            if (categories.length === 0) {
                return handleResponse({ status: HttpStatus.NOT_FOUND, message: ResponseMessages.CNot });
            }

            return handleResponse({ status: HttpStatus.OK, message: ResponseMessages.CG, response: categories });
        });
    }

    async updateCategory(id: string, categoryData: Partial<Category>, userId: string): Promise<ResponseSchema> {
        return TryCatchBlock(async () => {
            const category = await Category.findOne({ where: { id, user_id: userId, default_category: false } });

            if (!category) {
                return handleResponse({ status: HttpStatus.NOT_FOUND, message: ResponseMessages.CNot });
            }

            await category.update(categoryData);
            return handleResponse({ status: HttpStatus.OK, message: ResponseMessages.CPut, response: category });
        });
    }
}
