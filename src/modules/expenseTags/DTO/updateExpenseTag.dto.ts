import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateExpenseTagDto {
  @ApiPropertyOptional({
    description: 'ID of the expense (Optional)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsOptional()
  expense_id?: string;

  @ApiPropertyOptional({
    description: 'Name of the tag (Optional)',
    example: 'Important',
  })
  @IsString()
  @IsOptional()
  tag_name?: string;
}
