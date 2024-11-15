import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsOptional, IsString } from "class-validator";

export class GroupByCategoryDto {
    @ApiPropertyOptional({ description: 'Filter by start date', example: '2024-01-01' })
    @IsOptional()
    @IsDateString()
    start_date?: string;

    @ApiPropertyOptional({ description: 'Filter by end date', example: '2024-12-31' })
    @IsOptional()
    @IsDateString()
    end_date?: string;

    @ApiPropertyOptional({
        description: "The ID of the related file (optional)",
        example: "f1234a67-89b0-4567-c890-123456789abc",
    })
    @IsOptional()
    @IsString()
    file_id?: string;

}   