import { IsNotEmpty, IsString, IsDate, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRecurringExpenseDto {
  @ApiProperty({
    description: 'ID of the original expense being repeated',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  expense_id: string;

  @ApiProperty({
    description: 'Frequency of the recurring expense (e.g., daily, weekly, monthly)',
    example: 'monthly',
  })
  @IsString()
  @IsNotEmpty()
  frequency: string;

  @ApiProperty({
    description: 'Start date of the recurring expense',
    example: '2023-10-18T00:00:00.000Z',
  })
  @IsDate()
  @IsNotEmpty()
  start_date: Date;

  @ApiProperty({
    description: 'End date of the recurring expense (optional)',
    example: '2024-10-18T00:00:00.000Z',
  })
  @IsDate()
  @IsOptional()
  end_date?: Date;
}
