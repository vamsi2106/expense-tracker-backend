import { Controller, Get, Post, Body, Param, Delete, Put, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Controller('expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) { }

  @Post()
  async create(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expenseService.create(createExpenseDto);
  }


  @Get()
  async findAll(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('filter') filter?: string,
  ) {
    return this.expenseService.findAll(startDate, endDate, filter);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    let data = this.expenseService.findOne(id);

    if (!data) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: "Expense with the given Id does not exist" }, HttpStatus.NOT_FOUND
      )
    } else {
      return data;
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
    const updatedExpense = await this.expenseService.update(id, updateExpenseDto);

    if (!updatedExpense) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Expense not found or update failed' },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      status: 'success',
      message: 'Expense updated successfully',
      data: updatedExpense, // You can include the updated data if needed
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.expenseService.remove(id);

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

  //querry code
  @Get('filter/group-by-date')
  async getExpensesGroupedByDate(@Query('offset') offset: number) {
    return await this.expenseService.getExpensesGroupedByDateWithOffset(offset);
  }

  // Endpoint to get expenses grouped by category with optional start and end dates
  @Get('filter/group-by-category')
  async getExpensesGroupedByCategory(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return await this.expenseService.getExpensesGroupedByCategory(startDate, endDate);
  }

  @Get('filter/group-by-week')
  async getExpensesGroupedByWeek(
    @Query('month') month?: number, // Optional parameter
    @Query('year') year?: number,  // Optional parameter
  ) {
    // Default to the current month and year if not provided
    const currentDate = new Date();
    const defaultMonth = month ?? currentDate.getMonth() + 1; // Months are 0-indexed
    const defaultYear = year ?? currentDate.getFullYear();

    return this.expenseService.getExpensesGroupedByWeek(defaultMonth, defaultYear);
  }

  @Get('filter/group-by-month')
  async getExpensesGroupedByMonth(
    @Query('year') year?: number // Optional query parameter for the year
  ) {
    let currentDate = new Date();
    const defaultYear = year ?? currentDate.getFullYear();
    return this.expenseService.getExpensesGroupedByMonth(defaultYear);
  }

  @Get('filter/group-by-year')
  async getExpensesGroupedByYear() {
    return this.expenseService.getExpensesGroupedByYear();
  }

}