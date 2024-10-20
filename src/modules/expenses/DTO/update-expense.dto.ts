import { IsNotEmpty, IsString, IsNumber, IsDate, IsIn, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CategoriesList } from 'src/modules/categories/DTO/createCategory.dto';

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
    description: `The category of the expense (Optional). Valid options: ${CategoriesList.join(', ')}`,
    example: 'Equipment',
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({
    description: 'The file ID for an associated receipt or document (Optional)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsOptional()
  file_id?: string;
}
