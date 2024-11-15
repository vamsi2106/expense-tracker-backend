import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class QueryExpenseTagDto {
    @ApiPropertyOptional({
        description: 'Name of the tag (Optional)',
        example: 'Important',
    })
    @IsString()
    @IsOptional()
    name?: string;
}