import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { File } from '../models/file.model';

@Injectable()
export class FileDao {
  constructor(
    @InjectModel(File) private readonly fileModel: typeof File,
  ) {}

  async createFile(fileData: Partial<File>): Promise<File> {
    try {
      return await this.fileModel.create(fileData);
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
}
