import { Controller, Get, Post, Body, Param, Delete, Put, Query, HttpException, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
// import { RoleGuard } from '../auth/role.guard';
// import { Roles } from '../auth/role.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth-guard.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiQuery, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiTags('Expenses')
@ApiBearerAuth()
@Controller('/tracker/expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new expense' })
  @ApiResponse({ status: 201, description: 'The expense has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(@Body() createExpenseDto: CreateExpenseDto, @Req() req: any) {
    let userId = req.user.user_id;
    console.log(userId);
    return this.expenseService.create(createExpenseDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Retrieve all expenses' })
  @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Filter by start date' })
  @ApiQuery({ name: 'endDate', required: false, type: String, description: 'Filter by end date' })
  @ApiQuery({ name: 'filter', required: false, type: String, description: 'Additional filter criteria' })
  @ApiQuery({ name: 'transactionType', required: false, type: String, description: 'Filter by transaction type (income/expense)' })
  @ApiQuery({ name: 'currency', required: false, type: String, description: 'Filter by currency' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limit the number of results' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Offset for pagination' })
  @ApiResponse({ status: 200, description: 'List of all expenses.' })
  async findAll(
    @Req() req: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('filter') filter?: string,
    @Query('transactionType') transactionType?: string,
    @Query('currency') currency?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number
  ) {
    let userId = req.user.user_id;
    console.log(userId);
    return this.expenseService.findAll(userId, startDate, endDate, filter, transactionType, currency, limit, offset);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single expense by ID' })
  @ApiParam({ name: 'id', type: String, description: 'The ID of the expense to retrieve' })
  @ApiResponse({ status: 200, description: 'The expense with the given ID.' })
  @ApiResponse({ status: 404, description: 'Expense not found.' })
  async findOne(@Param('id') id: string, @Req() req: any) {
    let userId = req.user.user_id;
    const data = await this.expenseService.findOne(userId, id);

    if (!data) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: "Expense with the given Id does not exist" },
        HttpStatus.NOT_FOUND,
      );
    } else {
      return data;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update an expense by ID' })
  @ApiParam({ name: 'id', type: String, description: 'The ID of the expense to update' })
  @ApiResponse({ status: 200, description: 'The expense has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Expense not found.' })
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    let userId = req.user.user_id;
    const updatedExpense = await this.expenseService.update(userId, id, updateExpenseDto);

    if (!updatedExpense) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Expense not found or update failed' },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      status: 'success',
      message: 'Expense updated successfully',
      data: updatedExpense,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an expense by ID' })
  @ApiParam({ name: 'id', type: String, description: 'The ID of the expense to delete' })
  @ApiResponse({ status: 200, description: 'The expense has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Expense not found.' })
  async remove(@Param('id') id: string, @Req() req: any) {
    let userId = req.user.user_id;
    const result = await this.expenseService.remove(userId, id);

    if (!result) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Expense not found or deletion failed' },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      status: 'success',
      message: 'Expense deleted successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('filter/group-by-date')
  @ApiOperation({ summary: 'Get expenses grouped by date with offset' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Offset for grouping by date' })
  @ApiQuery({ name: 'file_id', required: false, type: String, description: 'Filter by file ID (optional)' })
  async getExpensesGroupedByDate(
    @Req() req: any,
    @Query('offset') offset: number,
    @Query('file_id') file_id?: string,
  ) {
    let userId = req.user.user_id;
    const defaultFileId = file_id ?? null;
    return await this.expenseService.getExpensesGroupedByDateWithOffset(userId, offset, defaultFileId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('filter/group-by-category')
  @ApiOperation({ summary: 'Get expenses grouped by category' })
  @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Start date for filtering' })
  @ApiQuery({ name: 'endDate', required: false, type: String, description: 'End date for filtering' })
  @ApiQuery({ name: 'file_id', required: false, type: String, description: 'Filter by file ID (optional)' })
  async getExpensesGroupedByCategory(
    @Req() req: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('file_id') file_id?: string,
  ) {
    let userId = req.user.user_id;
    const defaultFileId = file_id ?? null;
    return await this.expenseService.getExpensesGroupedByCategory(userId, defaultFileId, startDate, endDate);
  }

  @UseGuards(JwtAuthGuard)
  @Get('filter/group-by-week')
  @ApiOperation({ summary: 'Get expenses grouped by week' })
  @ApiQuery({ name: 'month', required: false, type: Number, description: 'Month for grouping by week (optional)' })
  @ApiQuery({ name: 'year', required: false, type: Number, description: 'Year for grouping by week (optional)' })
  @ApiQuery({ name: 'file_id', required: false, type: String, description: 'Filter by file ID (optional)' })
  async getExpensesGroupedByWeek(
    @Req() req: any,
    @Query('month') month?: number,
    @Query('year') year?: number,
    @Query('file_id') file_id?: string,
  ) {
    let userId = req.user.user_id;
    const currentDate = new Date();
    const defaultMonth = month ?? currentDate.getMonth() + 1;
    const defaultYear = year ?? currentDate.getFullYear();
    const defaultFileId = file_id ?? null;

    return await this.expenseService.getExpensesGroupedByWeek(userId, defaultMonth, defaultYear, defaultFileId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('filter/group-by-month')
  @ApiOperation({ summary: 'Get expenses grouped by month' })
  @ApiQuery({ name: 'year', required: false, type: Number, description: 'Year for grouping by month (optional)' })
  @ApiQuery({ name: 'file_id', required: false, type: String, description: 'Filter by file ID (optional)' })
  async getExpensesGroupedByMonth(
    @Req() req: any,
    @Query('year') year?: number,
    @Query('file_id') file_id?: string,
  ) {
    let userId = req.user.user_id;
    const currentDate = new Date();
    const defaultYear = year ? (year) : (currentDate.getFullYear());
    const defaultFileId = file_id ?? null;

    return await this.expenseService.getExpensesGroupedByMonth(userId,defaultFileId, defaultYear);
  }
}
