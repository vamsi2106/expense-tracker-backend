import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateCategoryDto {
    @ApiProperty({
        name: 'name',
        description: 'add the category name',
        example: 'Hospetal charges'
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({
        description: 'add type of category, either income or expense',
        example: 'income'
    })
    @IsOptional()
    @IsEnum(['income', 'expense'])
    type?: 'income' | 'expense';

    @IsOptional()
    @IsBoolean()
    defaultCategory?: boolean;
}
