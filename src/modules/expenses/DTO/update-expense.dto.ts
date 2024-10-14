import { IsNotEmpty, IsString, IsNumber, IsDate, IsIn, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

let categoriesList =[
  'Food',
  'Entertainment',
  'Taxes',
  'Transport',
  'Utilities',
  'Equipment',
  'Maintenance',
  'Office Expenses',
  'Events',
]
export class UpdateExpenseDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsDate()
  @Type(()=>Date)
  date?: Date;

  @IsOptional()
  @IsString()
  @IsIn([
    'Food',
    'Entertainment',
    'Taxes',
    'Transport',
    'Utilities',
    'Equipment',
    'Maintenance',
    'Office Expenses',
    'Events',
  ], { message: `Invalid category, only these values are allowed : ${categoriesList}` })
  category?: string;
}
