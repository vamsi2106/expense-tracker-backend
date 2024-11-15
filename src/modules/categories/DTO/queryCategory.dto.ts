import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class queryCategory{
    @IsOptional()
    @IsString()
    @ApiPropertyOptional({name : "name", 
        description:'name of the category',
    example : 'Hospetal charges'})
    name ?:string;

    
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