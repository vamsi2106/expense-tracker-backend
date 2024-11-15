import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { Category } from '../models/category.models'; // Adjust the import path as needed
import { Op } from 'sequelize';
import { handleResponse, ResponseSchema } from 'src/common/handleResponse';
import { ResponseMessages } from 'src/common/messages';
import { TryCatchBlock } from 'src/common/tryCatchBlock';
import { queryCategory } from 'src/modules/categories/DTO/queryCategory.dto';
import { AbstractCategoryDao } from '../abstract/categoryDao.abstract';
import { msSqlConstants } from '../connection/constants.mssql';

@Injectable()
export class CategoryDao implements AbstractCategoryDao {

    constructor(
        @Inject(msSqlConstants.Category)
        private readonly categoryModel: typeof Category
    ) { }

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
            const category = await this.categoryModel.findOne({ where: { id, user_id: userId } });
            if (!category) {
                return handleResponse({ status: HttpStatus.NOT_FOUND, message: ResponseMessages.CNot });
            }

            await category.destroy();
            return handleResponse({ status: HttpStatus.OK, message: ResponseMessages.CD });
        });
    }

    async getCategoryByName(name: string, userId: string): Promise<ResponseSchema> {
        return TryCatchBlock(async () => {
            const category = await this.categoryModel.findOne({
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
            const category = await this.categoryModel.findOne({ where: { id } });

            if (!category) {
                return handleResponse({ status: HttpStatus.NOT_FOUND, message: ResponseMessages.CNot });
            }

            return handleResponse({ status: HttpStatus.OK, message: ResponseMessages.CG, response: category });
        });
    }

    async getAllCategories(userId: string, params: queryCategory): Promise<ResponseSchema> {
        return TryCatchBlock(async () => {
            let { name } = params;
            const whereClause: any = [
                { user_id: userId },
                { default_category: true }
            ];

            if (name) {
                whereClause[0].name = name;
            }

            const categories = await this.categoryModel.findAll({
                where: {
                    [Op.or]: whereClause
                }
            });

            return handleResponse({ status: HttpStatus.OK, message: ResponseMessages.CG, response: categories });
        });
    }

    async getUserCategories(userId: string, params: queryCategory): Promise<ResponseSchema> {
        return TryCatchBlock(async () => {
            let { name, limit, offset } = params;
            const whereClause: any = [{ user_id: userId }];

            if (name) {
                whereClause[0].name = name;
            }
            if (!limit) {
                limit = 50;
            }
            if (!offset) {
                offset: 0;
            }

            const categories = await this.categoryModel.findAll({
                where: {
                    [Op.or]: whereClause
                },
                limit,
                offset
            });

            if (categories.length === 0) {
                return handleResponse({ status: HttpStatus.OK, message: ResponseMessages.GS, response: categories });
            }
            let size = await Category.count({
                where: { user_id: userId }
            });

            return handleResponse({ status: HttpStatus.OK, message: ResponseMessages.CG, response: categories, size });
        });
    }

    async updateCategory(id: string, categoryData: Partial<Category>, userId: string): Promise<ResponseSchema> {
        return TryCatchBlock(async () => {
            const category = await this.categoryModel.findOne({ where: { id, user_id: userId, default_category: false } });

            if (!category) {
                return handleResponse({ status: HttpStatus.NOT_FOUND, message: ResponseMessages.CNot });
            }

            await category.update(categoryData);
            return handleResponse({ status: HttpStatus.OK, message: ResponseMessages.CPut, response: category });
        });
    }

    async getCategorySize(user_id): Promise<ResponseSchema> {
        return TryCatchBlock(async () => {
            let response = await this.categoryModel.count({
                where: { user_id }
            });
            return handleResponse({ status: HttpStatus.OK, message: ResponseMessages.GS, response: { size: response } })
        })
    }
}
