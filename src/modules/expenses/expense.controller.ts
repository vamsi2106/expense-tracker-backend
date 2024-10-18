// import { Controller, Get, Post, Body, Param, Delete, Put, Query, HttpException, HttpStatus } from '@nestjs/common';
// import { ExpenseService } from './expense.service';
// import { CreateExpenseDto } from './dto/create-expense.dto';
// import { UpdateExpenseDto } from './dto/update-expense.dto';

// @Controller('expenses')
// export class ExpenseController {
//   constructor(private readonly expenseService: ExpenseService) { }

//   @Post()
//   async create(@Body() createExpenseDto: CreateExpenseDto) {
//     return this.expenseService.create(createExpenseDto);
//   }


//   @Get()
//   async findAll(
//     @Query('startDate') startDate?: string,
//     @Query('endDate') endDate?: string,
//     @Query('filter') filter?: string,
//   ) {
//     return this.expenseService.findAll(startDate, endDate, filter);
//   }

//   @Get(':id')
//   async findOne(@Param('id') id: string) {
//     let data = this.expenseService.findOne(id);

//     if (!data) {
//       throw new HttpException(
//         { status: HttpStatus.NOT_FOUND, error: "Expense with the given Id does not exist" }, HttpStatus.NOT_FOUND
//       )
//     } else {
//       return data;
//     }
//   }

//   @Put(':id')
//   async update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
//     const updatedExpense = await this.expenseService.update(id, updateExpenseDto);

//     if (!updatedExpense) {
//       throw new HttpException(
//         { status: HttpStatus.NOT_FOUND, error: 'Expense not found or update failed' },
//         HttpStatus.NOT_FOUND,
//       );
//     }

//     return {
//       status: 'success',
//       message: 'Expense updated successfully',
//       data: updatedExpense, // You can include the updated data if needed
//     };
//   }

//   @Delete(':id')
//   async remove(@Param('id') id: string) {
//     const result = await this.expenseService.remove(id);

//     if (!result) {
//       throw new HttpException(
//         { status: HttpStatus.NOT_FOUND, error: 'Expense not found or deletion failed' },
//         HttpStatus.NOT_FOUND,
//       );
//     }

//     return {
//       status: 'success',
//       message: 'Expense deleted successfully',
//     };
//   }

//   //querry code
//  // 1. Group by Date with Offset
// @Get('filter/group-by-date')
// async getExpensesGroupedByDate(
//   @Query('offset') offset: number,
//   @Query('file_id') file_id?: string // Optional file_id
// ) {
//   const defaultFileId = file_id ?? null; // Ensure file_id defaults to null
//   return await this.expenseService.getExpensesGroupedByDateWithOffset(offset, defaultFileId);
// }

// // 2. Group by Category
// @Get('filter/group-by-category')
// async getExpensesGroupedByCategory(
//   @Query('startDate') startDate?: string,
//   @Query('endDate') endDate?: string,
//   @Query('file_id') file_id?: string // Optional file_id
// ) {
//   const defaultFileId = file_id ?? null; // Ensure file_id defaults to null
//   return await this.expenseService.getExpensesGroupedByCategory(defaultFileId, startDate, endDate);
// }

// // 3. Group by Week
// @Get('filter/group-by-week')
// async getExpensesGroupedByWeek(
//   @Query('month') month?: number,  // Optional parameter
//   @Query('year') year?: number,    // Optional parameter
//   @Query('file_id') file_id?: string // Optional file_id
// ) {
//   const currentDate = new Date();
//   const defaultMonth = month ?? currentDate.getMonth() + 1; // Default to current month
//   const defaultYear = year ?? currentDate.getFullYear();    // Default to current year
//   const defaultFileId = file_id ?? null; // Ensure file_id defaults to null

//   return await this.expenseService.getExpensesGroupedByWeek(defaultMonth, defaultYear, defaultFileId);
// }

// // 4. Group by Month
// @Get('filter/group-by-month')
// async getExpensesGroupedByMonth(
//   @Query('year') year?: number,    // Optional query parameter for year
//   @Query('file_id') file_id?: string // Optional file_id
// ) {
//   const currentDate = new Date();
//   const defaultYear = year ?? currentDate.getFullYear();   // Default to current year
//   const defaultFileId = file_id ?? null;                   // Ensure file_id defaults to null

//   return await this.expenseService.getExpensesGroupedByMonth(defaultFileId, defaultYear);
// }

// // 5. Group by Year
// @Get('filter/group-by-year')
// async getExpensesGroupedByYear(
//   @Query('file_id') file_id?: string // Optional file_id
// ) {
//   const defaultFileId = file_id ?? null; // Ensure file_id defaults to null
//   return await this.expenseService.getExpensesGroupedByYear(defaultFileId);
// }

// }

import { Controller, Get, Post, Body, Param, Delete, Put, Query, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { RoleGuard } from '../auth/role.guard';
import { Roles } from '../auth/role.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth-guard.guard';
import { Role } from 'src/core/enums/roles.enum';


@Controller('users/:userId/expenses') // Updated path to include userId
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.user)
  @Post()
  async create(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expenseService.create(createExpenseDto);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.user)
  @Get()
  async findAll(
    @Param('userId') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('filter') filter?: string,
  ) {
    return this.expenseService.findAll(userId, startDate, endDate, filter);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.user)
  @Get(':id')
  async findOne(@Param('userId') userId: string, @Param('id') id: string) {
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

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.user)
  @Put(':id')
  async update(
    @Param('userId') userId: string,
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
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

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.user)
  @Delete(':id')
  async remove(@Param('userId') userId: string, @Param('id') id: string) {
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

  // Query methods

  // 1. Group by Date with Offset
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.user)
  @Get('filter/group-by-date')
  async getExpensesGroupedByDate(
    @Param('userId') userId: string,
    @Query('offset') offset: number,
    @Query('file_id') file_id?: string,
  ) {
    const defaultFileId = file_id ?? null;
    return await this.expenseService.getExpensesGroupedByDateWithOffset(userId, offset, defaultFileId);
  }

  // 2. Group by Category
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.user)
  @Get('filter/group-by-category')
  async getExpensesGroupedByCategory(
    @Param('userId') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('file_id') file_id?: string,
  ) {
    const defaultFileId = file_id ?? null;
    return await this.expenseService.getExpensesGroupedByCategory(userId, defaultFileId, startDate, endDate);
  }

  // 3. Group by Week
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.user)
  @Get('filter/group-by-week')
  async getExpensesGroupedByWeek(
    @Param('userId') userId: string,
    @Query('month') month?: number,
    @Query('year') year?: number,
    @Query('file_id') file_id?: string,
  ) {
    const currentDate = new Date();
    const defaultMonth = month ?? currentDate.getMonth() + 1;
    const defaultYear = year ?? currentDate.getFullYear();
    const defaultFileId = file_id ?? null;

    return await this.expenseService.getExpensesGroupedByWeek(userId, defaultMonth, defaultYear, defaultFileId);
  }

  // 4. Group by Month
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.user)
  @Get('filter/group-by-month')
  async getExpensesGroupedByMonth(
    @Param('userId') userId: string,
    @Query('year') year?: number,
    @Query('file_id') file_id?: string,
  ) {
    const currentDate = new Date();
    const defaultYear = year ?? currentDate.getFullYear();
    const defaultFileId = file_id ?? null;

    return await this.expenseService.getExpensesGroupedByMonth(userId, defaultFileId, defaultYear);
  }

  // 5. Group by Year
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.user)
  @Get('filter/group-by-year')
  async getExpensesGroupedByYear(@Param('userId') userId: string, @Query('file_id') file_id?: string) {
    const defaultFileId = file_id ?? null;
    return await this.expenseService.getExpensesGroupedByYear(userId, defaultFileId);
  }
}
