import { FileQueryDto } from "src/modules/files/DTO/filesQuery.dto";
import { File } from '../models/file.models';

export abstract class AbstractFileDao {
    abstract createFile(fileData: Partial<File>, options?: { transaction?: any }): Promise<File>;
    abstract findById(userId: string, id: string): Promise<File>;
    abstract findAll(userId: string, params: FileQueryDto): Promise<any>;
    abstract deleteFile(userId: string, id: string, options?: any): Promise<boolean>;
    abstract getFileSize(user_id: string): Promise<any>;
}