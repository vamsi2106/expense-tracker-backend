import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { FileDao } from 'src/database/mssql/dao/file.dao';
import { File } from 'src/database/mssql/models/file.models';
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
  ) { }

  // async uploadFile(userId: string, file: Express.Multer.File, fileUrl: string): Promise<File> {
  //   const { originalname, mimetype, size } = file;
  
  //   const fileData: Partial<File> = {
  //     originalFileName: originalname,
  //     mimeType: mimetype,
  //     fileUrl,
  //     size,
  //     user_id: userId,
  //   };
  
  //   const transaction = await this.sequelize.transaction();
  
  //   try {
  //     const newFile = await this.fileDao.createFile(fileData, { transaction });
  //     console.log("Entering into the block of processing CSV file");
  //     let processingResponse = await this.processCsvBuffer(userId, file.buffer, transaction, newFile.id);
  //     console.log("Processing Response", processingResponse);
  //     await transaction.commit();
  //     console.log('Transaction committed successfully.');
  //     return newFile;
  //   } catch (error) {
  //     await transaction.rollback();
  //     console.error('Transaction rollback due to error:', error.message);
  //     throw new HttpException(
  //       `File upload and processing failed: ${error.message}`,
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }
  
  // private async processCsvBuffer(userId: string, buffer: Buffer, transaction: any, fileId: string): Promise<void> {
  //   const readableStream = new stream.Readable();
  //   readableStream.push(buffer);
  //   readableStream.push(null);
  
  //   return new Promise<void>((resolve, reject) => {
  //     const expensePromises: Promise<any>[] = [];
  
  //     readableStream
  //       .pipe(csvParser())
  //       .on('data', async (row) => {
  //         try {
  //           const expenseData: CreateExpenseDto = {
  //             name: row.name,
  //             amount: parseFloat(row.amount),
  //             date: new Date(row.date),
  //             category: row.category,
  //             description: row.description,
  //             transaction_type: row.transaction_type,
  //             currency: row.currency,
  //             file_id: fileId,
  //           };
  
  //           console.log("Processing expense row:", expenseData);
  
  //           const insertResult: any = await this.expenseService.create(expenseData, userId, { transaction });
  //           console.log('Insert Result:', insertResult);
  //           if (insertResult.status !== 200) {
  //             reject(new HttpException(insertResult.message, HttpStatus.NOT_FOUND));
  //             return;
  //           }
  
  //           expensePromises.push(insertResult.response);
  //         } catch (error) {
  //           reject(new HttpException(`Error processing CSV row: ${error.message}`, HttpStatus.BAD_REQUEST));
  //         }
  //       })
  //       .on('end', async () => {
  //         try {
  //           await Promise.all(expensePromises);
  //           console.log('CSV file successfully processed.');
  //           resolve();
  //         } catch (error) {
  //           reject(new HttpException(`CSV processing failed: ${error.message}`, HttpStatus.BAD_REQUEST));
  //         }
  //       })
  //       .on('error', (error) => {
  //         reject(new HttpException(`CSV processing failed: ${error.message}`, HttpStatus.BAD_REQUEST));
  //       });
  //   });
  // }
  
//claude ai code start
async uploadFile(userId: string, file: Express.Multer.File, fileUrl: string): Promise<File> {
  const { originalname, mimetype, size } = file;
  const fileData: Partial<File> = {
    originalFileName: originalname,
    mimeType: mimetype,
    fileUrl,
    size,
    user_id: userId,
  };

  const transaction = await this.sequelize.transaction();

  try {
    const newFile = await this.fileDao.createFile(fileData, { transaction });
    console.log("entering into the block of processing csv file");
    await this.processCsvBuffer(userId, file.buffer, transaction, newFile.id);
    await transaction.commit();
    console.log('Transaction committed successfully.');
    return newFile;
  } catch (error) {
    await transaction.rollback();
    console.error('Transaction rollback due to error:', error.message);
    throw new HttpException(
      `File upload and processing failed: ${error.message}`,
      HttpStatus.BAD_REQUEST,
    );
  }
}

private async processCsvBuffer(userId: string, buffer: Buffer, transaction: any, fileId: string): Promise<void> {
  const readableStream = new stream.Readable();
  readableStream.push(buffer);
  readableStream.push(null);

  return new Promise<void>((resolve, reject) => {
    const expensePromises: Promise<any>[] = [];

    readableStream
      .pipe(csvParser())
      .on('data', (row) => {  // Remove async here
        try {
          const expenseData: CreateExpenseDto = {
            name: row.name,
            amount: parseFloat(row.amount),
            date: new Date(row.date),
            category: row.category,
            description: row.description,
            transaction_type: row.transaction_type,
            currency: row.currency,
            file_id: fileId,
          };

          console.log("Processing expense row:", expenseData);

          // Push the promise instead of awaiting it
          expensePromises.push(
            this.expenseService.create(expenseData, userId, { transaction })
              .then(result => {
                if (!result || result.status !== 200) {
                  throw new Error(result?.message || 'Failed to create expense');
                }
                return result.response;
              })
          );
        } catch (error) {
          reject(new HttpException(`Error processing CSV row: ${error.message}`, HttpStatus.BAD_REQUEST));
        }
      })
      .on('end', async () => {
        try {
          const results = await Promise.all(expensePromises);
          console.log('CSV file successfully processed.');
          resolve();
        } catch (error) {
          reject(new HttpException(`CSV processing failed: ${error.message}`, HttpStatus.BAD_REQUEST));
        }
      })
      .on('error', (error) => {
        reject(new HttpException(`CSV processing failed: ${error.message}`, HttpStatus.BAD_REQUEST));
      });
  });
}
//end of claude ai code


  async getFileById(userId: string, id: string): Promise<File> {
    const file = await this.fileDao.findById(userId, id);
    if (!file) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }
    return file;
  }

  async getAllFiles(userId: string): Promise<File[]> {
    return this.fileDao.findAll(userId);
  }

  async remove(userId: string, id: string): Promise<boolean> {
    const transaction = await this.sequelize.transaction();
    try {
      const file = await this.fileDao.findById(userId, id);
      if (!file) {
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);
      }

      await this.expenseService.deleteExpensesByFileId(userId, file.id, { transaction });

      const result = await this.fileDao.deleteFile(userId, id, { transaction });
      await transaction.commit();

      return result;
    } catch (error) {
      await transaction.rollback();
      console.error("Transaction rolled back due to error:", error.message);
      throw new HttpException(
        `Error deleting file and related expenses: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
