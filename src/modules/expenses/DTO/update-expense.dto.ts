import { IsNotEmpty, IsString, IsNumber, IsDate, IsIn, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType } from './create-expense.dto';
//import { CategoriesList } from 'src/modules/categories/DTO/createCategory.dto';

export class UpdateExpenseDto {
  @ApiPropertyOptional({
    description: 'The name of the expense (Optional)',
    example: 'Office Supplies',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'The ID of the user who created the expense (Optional)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsOptional()
  user_id?: string;

  @ApiPropertyOptional({
    description: 'The amount of the expense (Optional)',
    example: 300.00,
  })
  @IsNumber()
  @IsOptional()
  amount?: number;

  @ApiPropertyOptional({
    description: 'The date of the expense transaction (Optional)',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  date?: Date;

  @ApiPropertyOptional({
    description: `The category of the expense (Optional)}`,
    example: 'Equipment',
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({
    description: "The type of the transaction (income or expense)",
    example: TransactionType.EXPENSE,
    enum: TransactionType,  // Displays the enum values in Swagger
  })
  @IsOptional()
  @IsEnum(TransactionType)
  transaction_type?: TransactionType;

  @ApiPropertyOptional({
    description: "The currency used for the transaction",
    example: "USD",
  })
  @IsOptional()
  @IsString({message:"surrency should be of type string"})
  currency?: string;

  @ApiPropertyOptional({
    description: "A brief description of the transaction (optional)",
    example: "Payment for office rent",
  })
  @IsOptional()
  @IsString({message:"description should be of type string"})
  description?: string;

  @ApiPropertyOptional({
    description: 'The file ID for an associated receipt or document (Optional)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsOptional()
  file_id?: string;
}
