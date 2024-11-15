export abstract class AbstractAzureBlobStorage{
    abstract uploadFile(file: Express.Multer.File): Promise<string> ;
    //abstract downloadFileToResponse(fileName: string, res: Response): Promise<void>;
    abstract deleteFile(fileName: string): Promise<void>;
}