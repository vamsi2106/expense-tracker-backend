import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { File } from 'src/database/mssql/models/file.model';
import { FileDao } from 'src/database/mssql/dao/file.dao';
import { FileService } from './files.services';
import { FileController } from './files.controllers';
import { AzureBlobStorageService } from './azure-blob-storage';
import { DbModule } from 'src/database/database.module';
import { ExpenseService } from '../expenses/expense.service';

@Module({
  imports: [SequelizeModule.forFeature([File]),DbModule],
  providers: [FileDao, FileService, AzureBlobStorageService,ExpenseService],
  controllers: [FileController],
})
export class FileModule {}
