import { Type } from 'class-transformer';
import { IsNotEmpty, IsDate, IsOptional, IsString, IsNumber, IsDateString, IsEnum } from 'class-validator';
//import { IsDate } from 'sequelize-typescript';

// Define an enum for transaction types if it has fixed values
export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export class CreateExpenseDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  date: Date;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsEnum(TransactionType)  // Use enum if transaction types are fixed
  transaction_type: TransactionType;

  @IsNotEmpty()
  @IsString()
  currency: string;

  @IsOptional() // This makes file_id optional
  @IsString()
  file_id?: string; // Make sure this field is optional

  @IsOptional() // Description is also optional
  @IsString()
  description?: string;
}
