import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { FileDao } from 'src/database/mssql/dao/file.dao';
import { File } from 'src/database/mssql/models/file.model';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import { CreateExpenseDto } from '../expenses/dto/create-expense.dto';// Update the path accordingly
import { ExpenseService } from '../expenses/expense.service'; // Update the path accordingly


@Injectable()
export class FileService {
  constructor(private readonly fileDao: FileDao,
    private readonly expenseService: ExpenseService,
  ) {}

  async uploadFile(file: Express.Multer.File, fileUrl: string): Promise<File> {
    const { originalname, mimetype, size } = file;

    const fileData: Partial<File> = {
      originalFileName: originalname,
      mimeType: mimetype,
      fileUrl,
      size,
    };

    try {
      const newFile = await this.fileDao.createFile(fileData);
      await this.processCsvFile(file.path);
      return newFile;
    } catch (error) {
      throw new HttpException(
        `File upload failed: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async processCsvFile(filePath: string): Promise<void> {
    const expenses: CreateExpenseDto[] = [];
    
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', async (row) => {
        try {
          const expenseData: CreateExpenseDto = {
            name: row.name,
            email: row.email,
            amount: parseFloat(row.amount),
            date: new Date(row.date),
            category: row.category,
          };
          
          // Validate each expense using ExpenseService
          await this.expenseService.create(expenseData); // Assumes create method exists in ExpenseService
        } catch (error) {
          throw new HttpException(
            `Error processing row: ${JSON.stringify(row)} - ${error.message}`,
            HttpStatus.BAD_REQUEST,
          );
        }
      })
      .on('end', () => {
        console.log('CSV file successfully processed');
      })
      .on('error', (error) => {
        throw new HttpException(
          `CSV processing failed: ${error.message}`,
          HttpStatus.BAD_REQUEST,
        );
      });
  }

  async getFileById(id: string): Promise<File> {
    const file = await this.fileDao.findById(id);
    if (!file) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }
    return file;
  }

  async getAllFiles(): Promise<File[]> {
    return this.fileDao.findAll();
  }
}
