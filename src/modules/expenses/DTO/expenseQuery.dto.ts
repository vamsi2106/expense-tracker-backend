// import { ApiPropertyOptional } from '@nestjs/swagger';
// import { Type } from 'class-transformer';
// import { IsOptional, IsString, IsNumber, IsEnum, IsDateString, Min, Max,IsArray } from 'class-validator';

// import { CurrencyTypes } from 'src/database/mssql/models/expenses.models';

// export enum TransactionType {
//     INCOME = 'income',
//     EXPENSE = 'expense'
// }

// export class ExpenseQueryDto {
//     @ApiPropertyOptional({ description: 'Filter by expense name' })
//     @IsOptional()
//     @IsString()
//     name?: string;

//     @ApiPropertyOptional({ description: 'Filter by start date', example: '2024-01-01' })
//     @IsOptional()
//     @IsDateString()
//     start_date?: string;

//     @ApiPropertyOptional({ description: 'Filter by end date', example: '2024-12-31' })
//     @IsOptional()
//     @IsDateString()
//     end_date?: string;

//     @ApiPropertyOptional({ description: 'Filter by category' })
//     @IsOptional()
//     @IsString()
//     category?: string;

//     @ApiPropertyOptional({
//         description: 'Filter by transaction type',
//         enum: TransactionType
//     })
//     @IsOptional()
//     @IsEnum(TransactionType)
//     transaction_type?: TransactionType;

//     @ApiPropertyOptional({ description: 'Filter by currencies', example: ['USD', 'EUR'] })
//     @IsOptional()
//     @IsArray()
//     @IsEnum(CurrencyTypes, { each: true })
//     currency?: CurrencyTypes[];

//     @ApiPropertyOptional({
//         description: 'Limit the number of results',
//         minimum: 1,
//         maximum: 50,
//         default: 10
//     })
//     @IsOptional()
//     @Type(() => Number)
//     @IsNumber()
//     @Min(1)
//     @Max(50)
//     limit?: number;

//     @ApiPropertyOptional({
//         description: 'Offset for pagination',
//         minimum: 0
//     })
//     @IsOptional()
//     @Type(() => Number)
//     @IsNumber()
//     @Min(0)
//     offset?: number;

//     @ApiPropertyOptional({
//         description: 'Minimum price',
//         minimum: 0
//     })
//     @IsOptional()
//     @Type(() => Number)
//     @IsNumber()
//     @Min(0)
//     min_price?: number;

//     @ApiPropertyOptional({
//         description: 'Maximum price',
//         minimum: 0
//     })
//     @IsOptional()
//     @Type(() => Number)
//     @IsNumber()
//     @Min(0)
//     max_price?: number;
// }

// ExpenseQueryDto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsEnum, IsDateString, Min, Max, IsArray } from 'class-validator';
import { CurrencyTypes } from 'src/database/mssql/models/expenses.models';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense'
}

export class ExpenseQueryDto {
  @ApiPropertyOptional({ description: 'Filter by expense name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Filter by start date', example: '2024-01-01' })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiPropertyOptional({ description: 'Filter by end date', example: '2024-12-31' })
  @IsOptional()
  @IsDateString()
  end_date?: string;

  @ApiPropertyOptional({ description: 'Filter by categories' })
  @IsOptional()

  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Filter by transaction types', enum: TransactionType })
  @IsOptional()
  @IsString()
  transaction_type?: string;

  @ApiPropertyOptional({ description: 'Filter by currencies', example: ['USD', 'EUR'] })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({
    description: 'Limit the number of results',
    minimum: 1,
    maximum: 50,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(50)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Offset for pagination',
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset?: number;

  @ApiPropertyOptional({
    description: 'Minimum price',
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  min_price?: number;

  @ApiPropertyOptional({
    description: 'Maximum price',
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  max_price?: number;
}