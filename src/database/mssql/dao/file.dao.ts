import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { File } from '../models/file.models';
import { TryCatchBlock } from 'src/common/tryCatchBlock';
import { handleResponse } from 'src/common/handleResponse';
import { ResponseMessages } from 'src/common/messages';
import { FileQueryDto } from 'src/modules/files/DTO/filesQuery.dto';
import { Op, Sequelize } from 'sequelize';
import { AbstractFileDao } from '../abstract/fileDao.abstract';
import { msSqlConstants } from '../connection/constants.mssql';

@Injectable()
export class FileDao implements AbstractFileDao{
  constructor(
    @Inject(msSqlConstants.File) private readonly fileModel: typeof File,
    @Inject(msSqlConstants.SequelizeProvider) private readonly sequelize : Sequelize,
  ) { }
  async createFile(fileData: Partial<File>, options?: { transaction?: any }): Promise<File> {
    try {
      return await this.fileModel.create(fileData, { transaction: options?.transaction });
    } catch (error) {
      throw new Error(`Error inserting file data: ${error.message}`);
    }
  }


  async findById(userId: string, id: string): Promise<File> {
    return TryCatchBlock(async () => {
      let response = await this.fileModel.findOne({ where: { id, user_id: userId } });
      if (!response) {
        return handleResponse({ message: ResponseMessages.DataNot, status: HttpStatus.NOT_FOUND });
      }
      return handleResponse({ message: ResponseMessages.GS, response, status: HttpStatus.OK });

    })
  }

  async findAll(userId: string, params: FileQueryDto):Promise<any> {
    return TryCatchBlock(async () => {
      let whereClause: any = { user_id: userId };
      const { name, limit = 50, offset = 0 } = params; // Set default values for limit and offset

      if (name) {
        whereClause.originalFileName = {
          [Op.like]: `%${name}%`
        };;
      }

      // Use a single options object with `where`, `limit`, and `offset`
      let response = await this.fileModel.findAll({
        where: whereClause,
        limit,
        offset,
      });
      let size = await this.fileModel.count({ where: { user_id: userId } });
      return handleResponse({ message: ResponseMessages.GS, status: HttpStatus.OK, response, size })
    })
  }

  async deleteFile(userId: string, id: string, options?: any): Promise<boolean> {

    const file = await this.fileModel.findOne({ where: { id, user_id: userId } });

    if (!file) {
      return false; // File not found
    }

    // Use the provided options for transaction support
    await file.destroy(options); // Ensure this deletes the file within the transaction
    return true; // Deletion was successful
  }

  async getFileSize(user_id:string):Promise<any> {
    return TryCatchBlock(async () => {
      let response = await File.count({
        where: { user_id }
      });
      return response;
    })
  }
}