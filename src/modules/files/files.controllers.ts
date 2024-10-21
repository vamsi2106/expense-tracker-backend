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
import { AzureBlobStorageService } from './azure-blob-storage';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { RoleGuard } from '../auth/role.guard';
import { Roles } from '../auth/role.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth-guard.guard';

@ApiTags('Files')
@ApiBearerAuth() // Adds Authorization: Bearer token for protected routes
@Controller('users/:userId/files')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly azureBlobService: AzureBlobStorageService,
  ) {}

  @ApiOperation({ summary: 'Upload a file for a user' })
  @ApiParam({ name: 'userId', required: true, description: 'The ID of the user' })
  @ApiBody({
    description: 'File to upload',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
    schema: {
      example: {
        message: 'File uploaded successfully',
        file: {
          fileName: 'example.png',
          
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'No file uploaded' })
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@Param('userId') userId: string, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    try {
      const fileUrl = await this.azureBlobService.uploadFile(file);
      const savedFile = await this.fileService.uploadFile(userId, file, fileUrl);
      return { message: 'File uploaded successfully', file: savedFile };
    } catch (error) {
      throw new HttpException(
        `File upload failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Get a file by ID' })
  @ApiParam({ name: 'userId', required: true, description: 'The ID of the user' })
  @ApiParam({ name: 'id', required: true, description: 'The ID of the file' })
  @ApiResponse({
    status: 200,
    description: 'File found',
    schema: {
      example: {
        id: 'file_id',
        userId: 'user_id',
        fileName: 'example.png',
        fileUrl: 'https://example.com/file_url',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'File not found' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getFile(@Param('userId') userId: string, @Param('id') id: string) {
    const file = await this.fileService.getFileById(userId, id);
    return file;
  }

  @ApiOperation({ summary: 'Get all files for a user' })
  @ApiParam({ name: 'userId', required: true, description: 'The ID of the user' })
  @ApiResponse({
    status: 200,
    description: 'All files retrieved',
    schema: {
      example: [
        {
          id: 'file_id_1',
          userId: 'user_id',
          fileName: 'example1.png',
          fileUrl: 'https://example.com/file1_url',
        },
        {
          id: 'file_id_2',
          userId: 'user_id',
          fileName: 'example2.png',
          fileUrl: 'https://example.com/file2_url',
        },
      ],
    },
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllFiles(@Param('userId') userId: string) {
    return this.fileService.getAllFiles(userId);
  }

  @ApiOperation({ summary: 'Download a file by ID' })
  @ApiParam({ name: 'userId', required: true, description: 'The ID of the user' })
  @ApiParam({ name: 'id', required: true, description: 'The ID of the file to download' })
  @ApiResponse({
    status: 200,
    description: 'File downloaded',
    content: { 'application/octet-stream': { schema: { type: 'string', format: 'binary' } } },
  })
  @ApiResponse({ status: 404, description: 'File not found' })
  @UseGuards(JwtAuthGuard)
  @Get('download/:id')
  async downloadFile(@Param('userId') userId: string, @Param('id') id: string, @Res() res: Response) {
    const file = await this.fileService.getFileById(userId, id);
    if (!file) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }

    try {
      await this.azureBlobService.downloadFileToResponse(file.fileUrl, res);
    } catch (error) {
      throw new HttpException(
        `File download failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Delete a file by ID' })
  @ApiParam({ name: 'userId', required: true, description: 'The ID of the user' })
  @ApiParam({ name: 'id', required: true, description: 'The ID of the file to delete' })
  @ApiResponse({
    status: 200,
    description: 'File deleted successfully',
    schema: {
      example: {
        status: 'success',
        message: 'File deleted successfully',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'File does not exist to delete it' })
  @UseGuards(JwtAuthGuard)
  @Delete('/delete/:id')
  async remove(@Param('userId') userId: string, @Param('id') id: string) {
    const result = await this.fileService.remove(userId, id);
    if (!result) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'File does not exist to delete it' },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      status: 'success',
      message: 'File deleted successfully',
    };
  }
}
