import {
  Controller,
  Post,
  Get,
  Delete,
  Put,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwtAuthGuard.guard'; // Adjust the import path as needed
import { CreateCategoryDto } from './DTO/createCategory.dto'; // Adjust the import path as needed
import { UpdateCategoryDto } from './DTO/updateCategory.dto'; // Adjust the import path as needed
import { ApiBearerAuth, ApiQuery, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { queryCategory } from './DTO/queryCategory.dto';
import { AbstractCategory } from './category.abstract';

@ApiTags("Categories")
@ApiBearerAuth()
@Controller('expenses/categories')
@UseGuards(JwtAuthGuard)// Updated path to include userId
export class CategoryController {
  constructor(private readonly _categoryService: AbstractCategory) { }


  @ApiOperation({ summary: 'Create a new category' })
  // @ApiResponse({ status: 201, description: 'Category created successfully.' })
  // @ApiResponse({ status: 403, description: 'Forbidden.' })
  // @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() req: any
  ) {
    const { user_id, role } = req.user; // Retrieve userId from req.user
    return this._categoryService.createCategory({ ...createCategoryDto, user_id }, role);
  }

  @ApiOperation({ summary: 'Get all categories' })
  @ApiQuery({ name: 'name', required: false, description: 'Filter categories by name.' })
  @ApiResponse({ status: 200, description: 'List of categories.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('/fetch/all')
  async findAll(@Req() req: any, @Body() params: queryCategory) {
    const userId = req.user.user_id; // Retrieve userId from req.user
    return this._categoryService.getAllCategories(userId, params);
  }

  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'List of categories.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('/fetch/users')
  async findUserACategories(@Req() req: any,  @Body() params:queryCategory) {
    const userId = req.user.user_id; // Retrieve userId from req.user
    return await this._categoryService.getUserCategories(userId, params);
  }

  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({ status: 200, description: 'Category updated successfully.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, @Req() req: any) {
    const userId = req.user.user_id; // Retrieve userId from req.user
    return await this._categoryService.updateCategory(id, updateCategoryDto, userId);
  }

  @ApiOperation({ summary: 'Delete a category' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.user_id; // Retrieve userId from req.user
    return await this._categoryService.deleteCategory(id, userId);
  }
}
