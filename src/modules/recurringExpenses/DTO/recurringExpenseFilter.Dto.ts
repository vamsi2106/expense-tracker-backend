import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString, Matches } from "class-validator";

export class RecurringExpenseFilter {
    @ApiPropertyOptional({ description: 'Filter by expense name' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ description: 'Filter by start date', example: '2024-01-01' })
    @IsOptional()
    @IsDateString()
    start_date?: string;

    @ApiPropertyOptional({ description: 'Filter by end date', example: '2024-12-31' })
    @IsOptional()
    @IsDateString()
    end_date?: string;

    @ApiPropertyOptional({ description: 'Intervals of recurring tasks, possible values are daily,week,month,year,hour,minute', example: "daily,week" })
    @IsOptional()
    @IsString()
    interval?: string;

    @ApiPropertyOptional({ description: 'Time assigned to the recurring task', example: 'HH:MM:SS' })
    @IsOptional()
    @IsString({ message: 'Time must be a string.' })
    @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
        message: 'Time must be in HH:MM:SS format',
    })
    time?: string;

    @ApiPropertyOptional({ description: 'task status', example: true })
    @IsOptional()
    @IsBoolean()
    is_active?: boolean;

    @ApiPropertyOptional({
        description: 'Limit the number of results',
        default: 10,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    limit?: number;

    @ApiPropertyOptional({
        description: 'Offset for pagination',
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    offset?: number;
}