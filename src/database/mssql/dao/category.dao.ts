import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Category } from '../models/category.models'; // Adjust the import path as needed
import { User } from '../models/user.model'; // Adjust the import path as needed
import { Op } from 'sequelize';

@Injectable()
export class CategoryDao {
    async createCategory(categoryData: Partial<Category>, role: string): Promise<Category> {
        // Set default_category based on role
        const existingCategory = await Category.findOne({
            where: {
                [Op.or]: [
                    {
                        name: categoryData.name,
                        user_id: categoryData.user_id,
                    },
                    {
                        name: categoryData.name,
                        default_category: true,
                    },
                ],
            },
        });

        // If a user-defined category exists, throw an exception
        if (role === 'user' && existingCategory && !existingCategory.default_category) {
            throw new HttpException('User-defined category already exists', HttpStatus.CONFLICT);
        }

        // If a default category exists, throw an exception
        if (existingCategory && existingCategory.default_category) {
            throw new HttpException('A default category with this name already exists', HttpStatus.CONFLICT);
        }
        console.log(categoryData);
        return Category.create(categoryData);
    }

    async deleteCategory(id: string, userId: string): Promise<void> {
        const category = await Category.findOne({ where: { id, user_id: userId, default_category:false } });
        if (!category) {
            throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
        }
        await category.destroy();
    }

    async getCategoryByName(name: string, userId: string): Promise<Category | null> {
        const category = await Category.findOne(
            {
                where: {
                    [Op.or]: [
                        { name, user_id: userId },
                        { name, default_category: true, }
                    ]
                }
            });
        if (!category) {
            throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
        }
        return category;
    }

    async getCategoryById(id: string): Promise<Category | null> {
        const category = await Category.findOne({ where: { id } });
        if (!category) {
            throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
        }
        return category;
    }

    async getAllCategories(userId: string, name?: string, type?: string): Promise<Category[]> {
        const whereClause: any = [
            { user_id: userId },
            {default_category : true}
        ]

        // Add filters if provided
        if (name) {
            whereClause.name = name;
        }
        if (type) {
            whereClause.type = type; // Assuming 'type' is a valid column in the Category model
        }

        const categories = await Category.findAll({ where: {
            [Op.or]:whereClause}});

        // Handle case when no categories are found
        if (categories.length === 0) {
            throw new HttpException('No categories found', HttpStatus.NOT_FOUND);
        }

        return categories;
    }

    async updateCategory(id: string, categoryData: Partial<Category>, userId: string): Promise<Category> {
        const category = await Category.findOne({ where: { id, user_id: userId,default_category:false } });
        if (!category) {
            throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
        }
        return await category.update(categoryData);
    }
}
