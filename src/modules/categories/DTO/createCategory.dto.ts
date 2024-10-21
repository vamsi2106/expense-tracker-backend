import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsBoolean, IsOptional } from 'class-validator';

export const allCategories = [
    { name: 'Food', type: 'expense', default_Category: true },
    { name: 'Transportation', type: 'expense', default_Category: true },
    { name: 'Utilities', type: 'expense', default_Category: true },
    { name: 'Rent', type: 'expense', default_Category: true },
    { name: 'Entertainment', type: 'expense', default_Category: true },
    { name: 'Health & Wellness', type: 'expense', default_Category: true },
    { name: 'Salary', type: 'income', default_Category: true },
    { name: 'Investments', type: 'income', default_Category: true },
    { name: 'Freelance Income', type: 'income', default_Category: true },
    { name: 'Gifts', type: 'income', default_Category: true },
    { name: 'Gym Membership', type: 'expense', default_Category: false },
    { name: 'Side Hustle Income', type: 'income', default_Category: false },
  ];

// export const CategoriesList = [
//     'Food',
//     'Transportation',
//     'Utilities',
//     'Rent',
//     'Entertainment',
//     'Health & Wellness',
//     'Salary',
//     'Investments',
//     'Freelance Income',
//     'Gifts',
//   ];
  
  
export class CreateCategoryDto {
  @IsString()
  @ApiProperty({
    name:'name',
    description:'add the category name',
    example:'Hospetal charges'
  })
  name: string;

  @ApiProperty({
    description : 'add type of category, either income or expense',
    example:'income'
  })
  @IsEnum(['income', 'expense'])
  type: 'income' | 'expense';

  @IsBoolean()
  @IsOptional() // default categories added by admin can be optional
  defaultCategory?: boolean;
}
