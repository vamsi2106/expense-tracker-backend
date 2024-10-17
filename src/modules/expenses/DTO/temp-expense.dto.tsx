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
  'Others',
]
export class CreateExpenseDtoTemp {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsDate()
  @Type(()=>Date)
  @IsNotEmpty()
  date: Date;

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
  category: string;

  @IsString()
  @IsOptional()
  file_id ?: string;
}