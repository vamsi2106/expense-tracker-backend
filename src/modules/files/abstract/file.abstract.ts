import { FileQueryDto } from "../DTO/filesQuery.dto"
import { File } from 'src/database/mssql/models/file.models';

export abstract class AbstractFile{
    abstract uploadFile(userId: string, file: Express.Multer.File): Promise<File>;
    abstract handleFileUpload(userId: string,file: Express.Multer.File,transaction: any): Promise<File>
    abstract getFileById(userId: string, id: string): Promise<File>;
    abstract getAllFiles(userId: string, params: FileQueryDto): Promise<File[]>;
    abstract remove(userId: string, id: string);
    abstract getFileSize(user_id:string);
}