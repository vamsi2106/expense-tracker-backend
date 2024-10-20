import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { File } from '../models/file.models';

@Injectable()
export class FileDao {
  constructor(
    @InjectModel(File) private readonly fileModel: typeof File,
  ) {}

  async createFile(fileData: Partial<File>, options?: { transaction?: any }): Promise<File> {
    try {
      return await this.fileModel.create(fileData, { transaction: options?.transaction });
    } catch (error) {
      throw new Error(`Error inserting file data: ${error.message}`);
    }
  }
  

  async findById(userId:string,id: string): Promise<File> {
    return this.fileModel.findOne({where : {id, user_id : userId}});
  }

  async findAll(userId:string): Promise<File[]> {
    let whereClause = {user_id : userId}
    return this.fileModel.findAll({where : whereClause});
  }

  async deleteFile(userId:string, id: string, options?: any): Promise<boolean> {
    
    const file = await this.fileModel.findOne({where : {id, user_id : userId}});
    
    if (!file) {
      return false; // File not found
    }
  
    // Use the provided options for transaction support
    await file.destroy(options); // Ensure this deletes the file within the transaction
    return true; // Deletion was successful
  }
  
}