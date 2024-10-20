import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DbModule } from 'src/database/database.module';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryDao } from 'src/database/mssql/dao/category.dao';
import { Category } from 'src/database/mssql/models/category.models';

@Module({
  imports: [SequelizeModule.forFeature([Category]), DbModule],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryDao],
})
export class CategoryModule {}
