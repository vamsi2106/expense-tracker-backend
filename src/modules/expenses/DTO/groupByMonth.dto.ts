import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class GroupByDateDto {
    @ApiPropertyOptional({ description: 'Offset for grouping by date', example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    offset?: number;

    @ApiPropertyOptional({
        description: "The ID of the related file (optional)",
        example: "f1234a67-89b0-4567-c890-123456789abc",
    })
    @IsOptional()
    @IsString()
    file_id?: string;
}
export class GroupByWeekDto {
    @ApiPropertyOptional({ description: 'Filter by month', example: '2024-01-01' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    month?: number;

    @ApiPropertyOptional({ description: 'Filter by year', example: '2024-12-31' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    year?: number;

    @ApiPropertyOptional({
        description: "The ID of the related file (optional)",
        example: "f1234a67-89b0-4567-c890-123456789abc",
    })
    @IsOptional()
    @IsString()
    file_id?: string;

}

export class GroupByMonth {
    @ApiPropertyOptional({ description: 'Filter by year', example: '2024-12-31' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    year?: number;

    @ApiPropertyOptional({
        description: "The ID of the related file (optional)",
        example: "f1234a67-89b0-4567-c890-123456789abc",
    })
    @IsOptional()
    @IsString()
    file_id?: string;

}