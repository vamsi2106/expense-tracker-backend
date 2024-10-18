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
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './files.services';
import { Express, Response } from 'express';
import { AzureBlobStorageService } from './azure-blob-storage'; // Assumed you have a service for Azure Blob Storage
import { RoleGuard } from '../auth/role.guard';
import { Roles } from '../auth/role.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth-guard.guard';
import { Role } from 'src/core/enums/roles.enum';


@Controller('users/:userId/files')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly azureBlobService: AzureBlobStorageService, // Azure blob storage
  ) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.user)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file')) // This uses Multer to handle file upload
  async uploadFile(@Param('userId') userId:string, @UploadedFile() file: Express.Multer.File) {
      
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
      const savedFile = await this.fileService.uploadFile(userId,file, fileUrl);
      return { message: 'File uploaded successfully', file: savedFile };
    } catch (error) {
      throw new HttpException(
        `File upload failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.user)
  @Get(':id')
  async getFile(@Param('userId') userId:string, @Param('id') id: string) {
    const file = await this.fileService.getFileById(userId,id);
    return file;
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.user)
  @Get()
  async getAllFiles(@Param("userId") userId:string) {
    return this.fileService.getAllFiles(userId);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.user)
  @Get('download/:id')
  async downloadFile(@Param('userId') userId:string, @Param('id') id: string, @Res() res: Response) {
    const file = await this.fileService.getFileById(userId,id);
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

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.user)
  @Delete('/delete/:id')
  async remove(@Param('userId') userId:string,@Param('id') id:string){
    const result = await this.fileService.remove(userId,id);
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
