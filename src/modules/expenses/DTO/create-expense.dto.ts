import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsDate, IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';

// Define an enum for transaction types if it has fixed values
export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export class CreateExpenseDto {
  @ApiProperty({
    description: "The amount of the expense or income transaction",
    example: 5000,
  })
  @IsNotEmpty({message:"amount must be included in the body"})
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: "Date of the transaction (expense/income)",
    example: "2023-12-25T00:00:00.000Z",
  })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty({message:"date is required"})
  date: Date;

  @ApiProperty({
    description: "The name of the expense or income source",
    example: "Office rent",
  })
  @IsNotEmpty({message:"name is required"})
  @IsString({message:"name should be of type string"})
  name: string;

  @ApiProperty({
    description: "The category of the expense or income",
    example: "Utilities",
  })
  @IsNotEmpty({message:"category is required"})
  @IsString({message:"category should be of type string"})
  category: string;

  @ApiProperty({
    description: "The type of the transaction (income or expense)",
    example: TransactionType.EXPENSE,
    enum: TransactionType,  // Displays the enum values in Swagger
  })
  @IsNotEmpty({message:"transaction type is required"})
  @IsEnum(TransactionType)
  transaction_type: TransactionType;

  @ApiProperty({
    description: "The currency used for the transaction",
    example: "USD",
  })
  @IsNotEmpty({message:"currency is required"})
  @IsString({message:"surrency should be of type string"})
  currency: string;

  @ApiPropertyOptional({
    description: "The ID of the related file (optional)",
    example: "f1234a67-89b0-4567-c890-123456789abc",
  })
  @IsOptional()
  @IsString()
  file_id?: string;

  @ApiPropertyOptional({
    description: "A brief description of the transaction (optional)",
    example: "Payment for office rent",
  })
  @IsOptional()
  @IsString({message:"description should be of type string"})
  description?: string;
}
