import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Controller('expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

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
  async findOne(@Param('id') id: number) {
    return this.expenseService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expenseService.update(id, updateExpenseDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.expenseService.remove(id);
  }
}
