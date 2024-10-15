import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { File } from '../models/file.model';

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
  

  async findById(id: string): Promise<File> {
    return this.fileModel.findByPk(id);
  }

  async findAll(): Promise<File[]> {
    return this.fileModel.findAll();
  }

  async deleteFile(id: string, options?: any): Promise<boolean> {
    const file = await this.fileModel.findByPk(id);
    
    if (!file) {
      return false; // File not found
    }
  
    // Use the provided options for transaction support
    await file.destroy(options); // Ensure this deletes the file within the transaction
    return true; // Deletion was successful
  }
  
}