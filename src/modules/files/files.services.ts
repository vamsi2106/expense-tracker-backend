import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { File } from 'src/database/mssql/models/file.models';
import * as csvParser from 'csv-parser';
import { CreateExpenseDto } from '../expenses/dto/create-expense.dto';
import * as stream from 'stream';
import { FileQueryDto } from './DTO/filesQuery.dto';
import { handleResponse } from 'src/common/handleResponse';
import { ResponseMessages } from 'src/common/messages';
import { AbstractFileDao } from 'src/database/mssql/abstract/fileDao.abstract';
import { DatabaseService } from 'src/database/database.service';
import { AbstractExpense } from '../expenses/expense.abstract';
import { AbstractAzureBlobStorage } from './abstract/azureBlobStorage.abstract';
import { AbstractFile } from './abstract/file.abstract';
import { msSqlConstants } from 'src/database/mssql/connection/constants.mssql';
import { Sequelize } from 'sequelize';

@Injectable()
export class FileService implements AbstractFile{
  constructor(
    private readonly _fileTxn: AbstractFileDao,
    private readonly _dbSvc:DatabaseService,
    private readonly expenseService: AbstractExpense,
    @Inject(msSqlConstants.SequelizeProvider)
    private sequelize: Sequelize,
    private readonly azureBlobService: AbstractAzureBlobStorage,
  ) {
    this._fileTxn = this._dbSvc.fileSqlTxn; 
   }

  async uploadFile(userId: string, file: Express.Multer.File): Promise<File> {
    const transaction = await this.sequelize.transaction()
    let newFile:any = null;
    try {
      const parsedData = await this.parseCsvBuffer(file.buffer);
      newFile = await this.handleFileUpload(userId, file, transaction);

      await this.createExpenses(userId, parsedData, transaction, newFile.id);

      await transaction.commit();
      return newFile;
    } catch (error) {
      await transaction.rollback();
      await this.azureBlobService.deleteFile(newFile.originalFileName);
      console.error('Transaction rollback due to error:', error.message);
      throw new HttpException(
        `File upload and processing failed: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async handleFileUpload(
    userId: string,
    file: Express.Multer.File,
    transaction: any
  ): Promise<File> {
    const { originalname, mimetype, size } = file;
    const fileUrl = await this.azureBlobService.uploadFile(file);

    const fileData: Partial<File> = {
      originalFileName: originalname,
      mimeType: mimetype,
      fileUrl,
      size,
      user_id: userId,
    };

    return await this._fileTxn.createFile(fileData, { transaction });
  }

  parseCsvBuffer(buffer: Buffer): Promise<CreateExpenseDto[]> {
    return new Promise((resolve, reject) => {
      const readableStream = new stream.Readable();
      readableStream.push(buffer);
      readableStream.push(null);

      const parsedData: CreateExpenseDto[] = [];

      readableStream
        .pipe(csvParser())
        .on('data', (row) => {
          try {
            const expenseData = this.validateAndTransformRow(row);
            parsedData.push(expenseData);
          } catch (error) {
            reject(new HttpException(
              `Error processing CSV row: ${error.message}`,
              HttpStatus.BAD_REQUEST
            ));
          }
        })
        .on('end', () => {
          console.log('CSV parsing completed successfully.');
          resolve(parsedData);
        })
        .on('error', (error) => {
          reject(new HttpException(
            `CSV parsing failed: ${error.message}`,
            HttpStatus.BAD_REQUEST
          ));
        });
    });
  }

  validateAndTransformRow(row: any): CreateExpenseDto {
    if (!row.name || !row.amount || !row.date) {
      throw new Error('Missing required fields: name, amount, or date');
    }

    const amount = parseFloat(row.amount);
    if (isNaN(amount)) {
      throw new Error(`Invalid amount value: ${row.amount}`);
    }

    const date = new Date(row.date);
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date format: ${row.date}`);
    }

    return {
      name: row.name,
      amount: amount,
      date: date,
      category: row.category,
      description: row.description,
      transaction_type: row.transaction_type,
      currency: row.currency,
    };
  }

  async createExpenses(
    userId: string,
    expenses: CreateExpenseDto[],
    transaction: any,
    fileId: string
  ): Promise<void> {
    const expensePromises = expenses.map(async (expenseData) => {
      const enrichedExpenseData = {
        ...expenseData,
        file_id: fileId,
      };

      const result = await this.expenseService.create(
        enrichedExpenseData,
        userId,
        { transaction }
      );

      if (!result || result.status !== 200) {
        throw new Error(result?.message || 'Failed to create expense');
      }

      return result.response;
    });

    try {
      await Promise.all(expensePromises);
      console.log('All expenses created successfully.');
    } catch (error) {
      throw new HttpException(
        `Failed to create expenses: ${error.message}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }
  //end of upload file and expenses

  async getFileById(userId: string, id: string): Promise<File> {
    const file = await this._fileTxn.findById(userId, id);
    if (!file) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }
    return file;
  }

  async getAllFiles(userId: string, params: FileQueryDto): Promise<File[]> {
    return this._fileTxn.findAll(userId, params);
  }

  async remove(userId: string, id: string) {
    const transaction = await this.sequelize.transaction();
    try {
      const file:any = await this._fileTxn.findById(userId, id);
      let {originalFileName,id:fileId} = file.response.dataValues;
      if (!file) {
        handleResponse({ message: ResponseMessages.DataNot, status: HttpStatus.NOT_FOUND });
      }
      await this.azureBlobService.deleteFile(originalFileName);
      await this.expenseService.deleteExpensesByFileId(userId, fileId, { transaction });

      const result = await this._fileTxn.deleteFile(userId, id, { transaction });
      await transaction.commit();

      return handleResponse({ response: result, message: ResponseMessages.DS, status: HttpStatus.OK });
    } catch (error) {
      await transaction.rollback();
      return handleResponse({
        message: `${ResponseMessages.DE}-${error.message}`,
        status: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async getFileSize(user_id:string) {
    return await this._fileTxn.getFileSize(user_id);
  }
}
