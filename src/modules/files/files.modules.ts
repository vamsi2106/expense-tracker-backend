import { Module } from '@nestjs/common';
//import { SequelizeModule } from '@nestjs/sequelize';
import { File } from 'src/database/mssql/models/file.models';
import { FileDao } from 'src/database/mssql/dao/file.dao';
import { FileService } from './files.services';
import { FileController } from './files.controllers';
import { AzureBlobStorageService } from './azureBlobStorage';
import { DbModule } from 'src/database/database.module';
import { ExpenseService } from '../expenses/expense.service';
import { Sequelize } from 'sequelize';
import { AbstractFile } from './abstract/file.abstract';
import { AbstractAzureBlobStorage } from './abstract/azureBlobStorage.abstract';
import { AbstractExpense } from '../expenses/expense.abstract';

@Module({
  imports: [],
  providers: [
    {provide:AbstractExpense, useClass:ExpenseService},
    {provide : AbstractFile,useClass:FileService},
    {provide: AbstractAzureBlobStorage, useClass:AzureBlobStorageService}],
  controllers: [FileController],
})
export class FileModule {}
