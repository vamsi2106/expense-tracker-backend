import {
  Controller,
  Post,
  Get,
  Delete,
  Put,
  Body,
  Param,
  UseGuards,
  Req
} from '@nestjs/common';
import { ExpenseTagService } from './expenseTag.service';// Adjust the import path as needed
import { JwtAuthGuard } from '../auth/jwt-auth-guard.guard'; // Adjust the import path as needed
import { Roles } from '../auth/role.decorator'; // Adjust the import path as needed
import { Role } from 'src/core/enums/roles.enum'; // Adjust the import path as needed
import { CreateExpenseTagDto } from './DTO/createExpenseTag.dto'; // Adjust the import path as needed
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from '../auth/role.guard';

@ApiTags('Expense Tags')
@ApiBearerAuth()
@Controller('expenses/tags')
export class ExpenseTagController {
  constructor(private readonly expenseTagService: ExpenseTagService) {}

  @UseGuards(JwtAuthGuard,RoleGuard)
  @Roles(Role.user)
  @ApiOperation({ summary: 'Create a new expense tag' })
  @ApiResponse({ status: 201, description: 'Tag created successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post(':expenseId')
  async create(@Param('expenseId') expenseId:string, @Body() createExpenseTagDto: CreateExpenseTagDto, @Req() req: any) {
    console.log(expenseId);
    console.log('called successdully with body', createExpenseTagDto);
    const { user_id } = req.user; // Retrieve userId from req.user
    return this.expenseTagService.createExpenseTag(createExpenseTagDto, user_id,expenseId);
  }


  @UseGuards(JwtAuthGuard,RoleGuard)
  @Roles(Role.user)
  @ApiOperation({ summary: 'Get all tags for an expense' })
  @ApiResponse({ status: 200, description: 'List of expense tags.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get(':expenseId')
  async findById(@Param('expenseId') expenseId: string, @Req() req: any) {
    
    const userId = req.user.user_id; // Retrieve userId from req.user
    return this.expenseTagService.getTagsForExpense(expenseId, userId);
  }

  @UseGuards(JwtAuthGuard,RoleGuard)
  @Roles(Role.user)
  @ApiOperation({ summary: 'Get all tags for an expense' })
  @ApiResponse({ status: 200, description: 'List of expense tags.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get()
  async findAll( @Req() req: any) {
    const userId = req.user.user_id; // Retrieve userId from req.user
    return this.expenseTagService.getALLTagsForExpense(userId);
  }

  @UseGuards(JwtAuthGuard,RoleGuard)
  @Roles(Role.user)
  @ApiOperation({ summary: 'Update a tag' })
  @ApiResponse({ status: 200, description: 'Tag updated successfully.' })
  @ApiResponse({ status: 404, description: 'Tag not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateExpenseTagDto: CreateExpenseTagDto, @Req() req: any) {
    const userId = req.user.user_id; // Retrieve userId from req.user
    return this.expenseTagService.updateExpenseTag(id, updateExpenseTagDto, userId);
  }

  @UseGuards(JwtAuthGuard,RoleGuard)
  @Roles(Role.user)
  @ApiOperation({ summary: 'Delete a tag' })
  @ApiResponse({ status: 200, description: 'Tag deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Tag not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.user_id; // Retrieve userId from req.user
    await this.expenseTagService.deleteExpenseTag(id, userId);
    return { message: 'Tag deleted successfully' };
  }
}
