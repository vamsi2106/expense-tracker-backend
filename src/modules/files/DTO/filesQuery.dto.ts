import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class FileQueryDto{
    @ApiPropertyOptional({name:'name', description:'search by file name', example:"sample.csv"})
    @IsString()
    @IsOptional()
    name ?: string;

    @ApiPropertyOptional({
        name:'limit',
        description:'No of rows required',
        example:10
    })
    @IsOptional()
    @IsNumber()
    limit?:number;

    @ApiPropertyOptional({
        name:'offset',
        description:'No of rows to skip',
        example:10
    })
    @IsNumber()
    @IsOptional()
    offset?:number;

}