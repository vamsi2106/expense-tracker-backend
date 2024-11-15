import { Controller, Get, Post, Body, Param, Delete, Put, Query, HttpException, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
// import { RoleGuard } from '../auth/role.guard';
// import { Roles } from '../auth/role.decorator';
import { JwtAuthGuard } from '../auth/jwtAuthGuard.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiQuery, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ExpenseQueryDto } from './DTO/expenseQuery.dto';
import { GroupByCategoryDto } from './DTO/groupByCategory.Dto';
import { GroupByDateDto, GroupByMonth, GroupByWeekDto } from './DTO/groupByMonth.dto';
import { AbstractExpense } from './expense.abstract';

@ApiTags('Expenses')
@ApiBearerAuth()
@Controller('/tracker/expenses')
@UseGuards(JwtAuthGuard)
export class ExpenseController {
  constructor(private readonly expenseService: AbstractExpense) { }

  @Post()
  @ApiOperation({ summary: 'Create a new expense' })
  @ApiResponse({ status: 201, description: 'The expense has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(@Body() createExpenseDto: CreateExpenseDto, @Req() req: any) {
    let userId = req.user.user_id;
    return this.expenseService.create(createExpenseDto, userId);
  }


  @Post('/fetch/data')  // Changed to Post for body data
  @ApiOperation({ summary: 'Retrieve all expenses' })
  @ApiResponse({ status: 200, description: 'List of all expenses.' })
  async findAll(
    @Req() req: any,
    @Body() query: ExpenseQueryDto  // Changed to @Body to accept from body instead of query
  ) {
    const userId = req.user.user_id;

    return await this.expenseService.findAll(userId, query);
  }

  @ApiOperation({ summary: 'Retrieve size of the tabel' })
  @ApiResponse({ status: 200, description: 'Gets ths size of the tabel' })
  @Get('/fetch/size')
  async findSize(@Req() req: any) {
    let { user_id } = req.user;
    return await this.expenseService.getlength(user_id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single expense by ID' })
  @ApiParam({ name: 'id', type: String, description: 'The ID of the expense to retrieve' })
  @ApiResponse({ status: 200, description: 'The expense with the given ID.' })
  @ApiResponse({ status: 404, description: 'Expense not found.' })
  async findOne(@Param('id') id: string, @Req() req: any) {
    let userId = req.user.user_id;
    return await this.expenseService.findOne(userId, id);
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
    return updatedExpense;
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
    @Query() params: GroupByDateDto
  ) {
    let { file_id, offset } = params;
    let userId = req.user.user_id;
    const defaultFileId = file_id ?? null;
    return await this.expenseService.getExpensesGroupedByDateWithOffset(userId, offset, defaultFileId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('filter/group-by-category')
  @ApiOperation({ summary: 'Get expenses grouped by category' })
  async getExpensesGroupedByCategory(
    @Req() req: any,
    @Query() query: GroupByCategoryDto,
  ) {
    let userId = req.user.user_id;
    let { file_id, start_date, end_date } = query;
    const defaultFileId = file_id ?? null;
    return await this.expenseService.getExpensesGroupedByCategory(userId, defaultFileId, start_date, end_date);
  }

  @UseGuards(JwtAuthGuard)
  @Get('filter/group-by-week')
  @ApiOperation({ summary: 'Get expenses grouped by week' })
  async getExpensesGroupedByWeek(
    @Req() req: any,
    @Query() params: GroupByWeekDto
  ) {
    let { month, year, file_id } = params;
    let userId = req.user.user_id;
    const currentDate = new Date();
    const defaultMonth = isNaN(month) ? currentDate.getMonth() + 1 : month;
    const defaultYear = isNaN(year) ? currentDate.getFullYear() : year;
    const defaultFileId = file_id ?? null;
    return await this.expenseService.getExpensesGroupedByWeek(userId, defaultMonth, defaultYear, defaultFileId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('filter/group-by-month')
  @ApiOperation({ summary: 'Get expenses grouped by month' })
  async getExpensesGroupedByMonth(
    @Req() req: any,
    @Query() params: GroupByMonth
  ) {
    let userId = req.user.user_id;
    let { year, file_id } = params;
    const currentDate = new Date();
    const defaultYear = year ? (year) : (currentDate.getFullYear());
    const defaultFileId = file_id ?? null;

    return await this.expenseService.getExpensesGroupedByMonth(userId, defaultFileId, defaultYear);
  }
}
