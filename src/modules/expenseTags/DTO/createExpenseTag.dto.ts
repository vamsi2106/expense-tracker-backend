import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExpenseTagDto {
  // @ApiProperty({
  //   description: 'ID of the expense to which this tag is associated',
  //   example: '123e4567-e89b-12d3-a456-426614174000',
  // })
  // @IsString()
  // @IsNotEmpty()
  // expense_id: string;

  @ApiProperty({
    description: 'Name of the tag',
    example: 'Urgent',
  })
  @IsString()
  @IsNotEmpty()
  tag_name: string;
}
