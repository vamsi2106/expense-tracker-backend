import { IsString, IsDate, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRecurringExpenseDto {
  @ApiPropertyOptional({
    description: 'ID of the original expense being repeated (Optional)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsOptional()
  expense_id?: string;

  @ApiPropertyOptional({
    description: 'Frequency of the recurring expense (Optional)',
    example: 'weekly',
  })
  @IsString()
  @IsOptional()
  frequency?: string;

  @ApiPropertyOptional({
    description: 'Start date of the recurring expense (Optional)',
    example: '2023-10-18T00:00:00.000Z',
  })
  @IsDate()
  @IsOptional()
  start_date?: Date;

  @ApiPropertyOptional({
    description: 'End date of the recurring expense (Optional)',
    example: '2024-10-18T00:00:00.000Z',
  })
  @IsDate()
  @IsOptional()
  end_date?: Date;
}
