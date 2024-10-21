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
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { CategoryService } from './category.service'; // Adjust the import path as needed
  import { JwtAuthGuard } from '../auth/jwt-auth-guard.guard'; // Adjust the import path as needed
  // import { RoleGuard } from '../auth/role.guard'; // Adjust the import path as needed
  // import { Roles } from '../auth/role.decorator'; // Adjust the import path as needed
  // import { Role } from 'src/core/enums/roles.enum'; // Adjust the import path as needed
  import { CreateCategoryDto } from './DTO/createCategory.dto'; // Adjust the import path as needed
  import { UpdateCategoryDto } from './DTO/updateCategory.dto'; // Adjust the import path as needed
  import { ApiBearerAuth, ApiQuery, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
  
  @ApiTags("Categories")
  @ApiBearerAuth()
  @Controller('expenses/categories') // Updated path to include userId
  export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }
  
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Create a new category' })
    @ApiResponse({ status: 201, description: 'Category created successfully.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    @Post()
    async create(
      @Body() createCategoryDto: CreateCategoryDto,
      @Req() req: any
    ) {
      const { user_id, role } = req.user; // Retrieve userId from req.user
      return this.categoryService.createCategory({ ...createCategoryDto, user_id }, role);
    }
  
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get all categories' })
    @ApiQuery({ name: 'filter', required: false, description: 'Filter categories by name.' })
    @ApiResponse({ status: 200, description: 'List of categories.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @Get()
    async findAll(@Req() req: any, @Query('name') name?: string) {
      const userId = req.user.user_id; // Retrieve userId from req.user
      console.log("findAll is triggered", userId, req.user);
      return this.categoryService.getAllCategories(userId, name);
    }
    
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get all categories' })
    @ApiQuery({ name: 'filter', required: false, description: 'Filter categories by name.' })
    @ApiResponse({ status: 200, description: 'List of categories.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @Get('/users')
    async findUserACategories(@Req() req: any, @Query('name') name?: string) {
      const userId = req.user.user_id; // Retrieve userId from req.user
      console.log("findAll is triggered", userId, req.user);
      return this.categoryService.getAllCategories(userId, name);
    }
  
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Update a category' })
    @ApiResponse({ status: 200, description: 'Category updated successfully.' })
    @ApiResponse({ status: 404, description: 'Category not found.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @Put(':id')
    async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, @Req() req: any) {
      const userId = req.user.user_id; // Retrieve userId from req.user
      return this.categoryService.updateCategory(id, updateCategoryDto, userId);
    }
  
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Delete a category' })
    @ApiResponse({ status: 200, description: 'Category deleted successfully.' })
    @ApiResponse({ status: 404, description: 'Category not found.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @Delete(':id')
    async remove(@Param('id') id: string, @Req() req: any) {
      const userId = req.user.user_id; // Retrieve userId from req.user
      await this.categoryService.deleteCategory(id, userId);
      return { message: 'Category deleted successfully' };
    }
  }
  