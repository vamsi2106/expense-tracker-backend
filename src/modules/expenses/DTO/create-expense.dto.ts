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
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: "Date of the transaction (expense/income)",
    example: "2023-12-25T00:00:00.000Z",
  })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  date: Date;

  @ApiProperty({
    description: "The name of the expense or income source",
    example: "Office rent",
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: "The category of the expense or income",
    example: "Utilities",
  })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({
    description: "The type of the transaction (income or expense)",
    example: TransactionType.EXPENSE,
    enum: TransactionType,  // Displays the enum values in Swagger
  })
  @IsNotEmpty()
  @IsEnum(TransactionType)
  transaction_type: TransactionType;

  @ApiProperty({
    description: "The currency used for the transaction",
    example: "USD",
  })
  @IsNotEmpty()
  @IsString()
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
  @IsString()
  description?: string;
}
