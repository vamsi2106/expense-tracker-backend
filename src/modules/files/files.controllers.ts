import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  Param,
  Res,
  HttpException,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './files.services';
import { Express, Response } from 'express';
import { AzureBlobStorageService } from './azure-blob-storage'; // Assumed you have a service for Azure Blob Storage


@Controller('files')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly azureBlobService: AzureBlobStorageService, // Azure blob storage
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file')) // This uses Multer to handle file upload
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
      
      if (!file) {
          console.log('file is required');
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    try {
      console.log('file is passed in the request');
      // Upload the file to Azure Blob Storage and get the URL
      const fileUrl = await this.azureBlobService.uploadFile(file);
      console.log(fileUrl,"fileUrl");
      // Save file details to DB
      const savedFile = await this.fileService.uploadFile(file, fileUrl);
      return { message: 'File uploaded successfully', file: savedFile };
    } catch (error) {
      throw new HttpException(
        `File upload failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getFile(@Param('id') id: string) {
    const file = await this.fileService.getFileById(id);
    return file;
  }

  @Get()
  async getAllFiles() {
    return this.fileService.getAllFiles();
  }

  @Get('download/:id')
  async downloadFile(@Param('id') id: string, @Res() res: Response) {
    const file = await this.fileService.getFileById(id);
    if (!file) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }

    try {
      // Retrieve file from Azure Blob Storage and pipe it to the response
      await this.azureBlobService.downloadFileToResponse(file.fileUrl, res);
    } catch (error) {
      throw new HttpException(
        `File download failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('delete/:id')
  async remove(@Param('id') id:string){
    const result = await this.fileService.remove(id);
    if(!result){
      throw new HttpException(
        {status:HttpStatus.NOT_FOUND, error : 'File does not exist to delete it'},
        HttpStatus.NOT_FOUND
      )
    } 

    return {
      status: 'success',
      message: 'File deleted successfully',
    };
  }
}
