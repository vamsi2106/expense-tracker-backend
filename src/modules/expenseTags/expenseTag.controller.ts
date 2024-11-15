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
  Query
} from '@nestjs/common';
import { ExpenseTagService } from './expenseTag.service';// Adjust the import path as needed
import { JwtAuthGuard } from '../auth/jwtAuthGuard.guard'; // Adjust the import path as needed
import { CreateExpenseTagDto } from './DTO/createExpenseTag.dto'; // Adjust the import path as needed
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QueryExpenseTagDto } from './DTO/queryExpenseTag.dto';
import { AbstractExpenseTag } from './expenseTag.abstract';

@ApiTags('Expense Tags')
@ApiBearerAuth()
@Controller('expenses/tags')
@UseGuards(JwtAuthGuard)
export class ExpenseTagController {
  constructor(private readonly expenseTagService: AbstractExpenseTag) {}

  @ApiOperation({ summary: 'Create a new expense tag' })
  @ApiResponse({ status: 201, description: 'Tag created successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post(':expenseId')
  async create(@Param('expenseId') expenseId:string, @Body() createExpenseTagDto: CreateExpenseTagDto, @Req() req: any) {
    const { user_id } = req.user; // Retrieve userId from req.user
    return await this.expenseTagService.createExpenseTag(createExpenseTagDto, user_id,expenseId);
  }

  @ApiOperation({ summary: 'Get tag for an expense' })
  @ApiResponse({ status: 200, description: 'List of expense tags.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get(':expenseId')
  async findById(@Param('expenseId') expenseId: string, @Req() req: any) {
    
    const userId = req.user.user_id; // Retrieve userId from req.user
    return await this.expenseTagService.getTagsForExpense(expenseId, userId);
  }

  
  @ApiOperation({ summary: 'Get all tags for an expense' })
  @ApiResponse({ status: 200, description: 'List of expense tags.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('/fetch/all')
  async findAll( @Req() req: any, @Body() params:QueryExpenseTagDto ) {
    const userId = req.user.user_id; // Retrieve userId from req.user
    return await this.expenseTagService.getALLTagsForExpense(userId,params);
  }

  @ApiOperation({ summary: 'Get the size of the tags' })
  @ApiResponse({ status: 200, description: 'Object of tabel size' })
  @Get('/fetch/size')
  async findSize( @Req() req: any) {
    const userId = req.user.user_id; // Retrieve userId from req.user
    return await this.expenseTagService.getExpensesTagSize(userId);
  }

  

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a tag' })
  @ApiResponse({ status: 200, description: 'Tag updated successfully.' })
  @ApiResponse({ status: 404, description: 'Tag not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateExpenseTagDto: CreateExpenseTagDto, @Req() req: any) {
    const userId = req.user.user_id; // Retrieve userId from req.user
    let result = await this.expenseTagService.updateExpenseTag(id, updateExpenseTagDto, userId);
    return result
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a tag' })
  @ApiResponse({ status: 200, description: 'Tag deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Tag not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.user_id; // Retrieve userId from req.user
    let result = await this.expenseTagService.deleteExpenseTag(id, userId);
    return result;
  }
}
