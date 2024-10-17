import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { FileDao } from 'src/database/mssql/dao/file.dao';
import { File } from 'src/database/mssql/models/file.model';
import * as csvParser from 'csv-parser';
import { CreateExpenseDto } from '../expenses/dto/create-expense.dto';
import { ExpenseService } from '../expenses/expense.service';
import { Sequelize } from 'sequelize-typescript';
import * as stream from 'stream';

@Injectable()
export class FileService {
  constructor(
    private readonly fileDao: FileDao,
    private readonly expenseService: ExpenseService,
    private readonly sequelize: Sequelize,
  ) {}

  async uploadFile(userId:string, file: Express.Multer.File, fileUrl: string): Promise<File> {
    const { originalname, mimetype, size } = file;
  
    const fileData: Partial<File> = {
      originalFileName: originalname,
      mimeType: mimetype,
      fileUrl,
      size,
      user_id : userId
    };
  
    const transaction = await this.sequelize.transaction();
  
    try {
      const newFile = await this.fileDao.createFile(fileData, { transaction });
      console.log(newFile, 'File added to the DB');
  
      // Pass the file ID to the CSV processing method
      await this.processCsvBuffer(userId,file.buffer, transaction, newFile.id);
  
      await transaction.commit();
      return newFile;
    } catch (error) {
      await transaction.rollback();
      console.error("Transaction rolled back due to error: ", error.message);
      throw new HttpException(
        `File upload and processing failed: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async processCsvBuffer(userId:string,buffer: Buffer, transaction: any, fileId: string): Promise<void> {
    const expenses: CreateExpenseDto[] = [];
    const readableStream = new stream.Readable();
    readableStream.push(buffer);
    readableStream.push(null);
  
    return new Promise<void>((resolve, reject) => {
      const expensePromises = [];
  
      readableStream
        .pipe(csvParser())
        .on('data', (row) => {
          const expenseData: CreateExpenseDto = {
            name: row.name,
            user_id: userId,
            amount: parseFloat(row.amount),
            date: new Date(row.date),
            category: row.category,
            file_id: fileId, // Assign file_id to the expense
          };
  
          console.log("Processing expense row: ", expenseData);
  
          expensePromises.push(
            this.expenseService.create(expenseData, { transaction })
          );
        })
        .on('end', async () => {
          try {
            await Promise.all(expensePromises);
            console.log('CSV file successfully processed');
            resolve();
          } catch (error) {
            console.error("Error processing CSV file: ", error.message);
            reject(new HttpException(
              `CSV processing failed: ${error.message}`,
              HttpStatus.BAD_REQUEST,
            ));
          }
        })
        .on('error', (error) => {
          console.error("CSV processing failed: ", error.message);
          reject(new HttpException(
            `CSV processing failed: ${error.message}`,
            HttpStatus.BAD_REQUEST,
          ));
        });
    });
  }
  
  async getFileById(userId:string, id: string): Promise<File> {
    const file = await this.fileDao.findById(userId,id);
    if (!file) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }
    return file;
  }

  async getAllFiles(userId:string): Promise<File[]> {
    return this.fileDao.findAll(userId);
  }

  async remove(userId:string, id: string): Promise<boolean> {
    console.log(userId);
    const transaction = await this.sequelize.transaction();
    try {
      // First, find the file by ID
      const file = await this.fileDao.findById(userId,id);
      if (!file) {
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);
      }

      // Delete expenses associated with the file ID
      await this.expenseService.deleteExpensesByFileId(userId,file.id, { transaction });

      // Delete the file
      const result = await this.fileDao.deleteFile(userId, id, { transaction });
      
      await transaction.commit();

      return result;
    } catch (error) {
      await transaction.rollback();
      console.error("Transaction rolled back due to error: ", error.message);
      throw new HttpException(
        `Error deleting file and related expenses: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
