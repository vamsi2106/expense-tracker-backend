import { Injectable } from '@nestjs/common';
import { BlobServiceClient } from '@azure/storage-blob';
import { Response } from 'express';
import { ConfigServices } from 'src/config/appconfig.service';
import { sasUrl } from './sasToken';

@Injectable()
export class AzureBlobStorageService {
  private blobServiceClient: BlobServiceClient;
  private configServices = new ConfigServices();
  private appContainerName = this.configServices.getappContainerName();
  private logContainerName = this.configServices.getLogContainerName();
  private connectionString = this.configServices.getConnectionString();

  constructor() {
    this.blobServiceClient = BlobServiceClient.fromConnectionString(
        this.configServices.getConnectionString()
    );
  }
  
  

  async uploadFile(file: Express.Multer.File): Promise<string> {
    console.log(this.appContainerName);
    console.log(this.connectionString);
    const containerClient = this.blobServiceClient.getContainerClient(this.appContainerName);
    const blockBlobClient = containerClient.getBlockBlobClient(file.originalname);

    const uploadBlobResponse = await blockBlobClient.uploadData(file.buffer);
    //console.log(uploadBlobResponse,'uploadBlockResponse');
    if (!uploadBlobResponse) {
      throw new Error('File upload to Azure failed');
    }

    // Log the upload event
    //await this.logEvent(`Uploaded file: ${file.originalname}`);
    //console.log(blockBlobClient,blockBlobClient);
    let fileLink = sasUrl(file.originalname);
    //console.log(fileLink, 'sas link');
    return fileLink; // Return the URL of the uploaded file
  }

  private async logEvent(message: string) {
    const logContainerClient = this.blobServiceClient.getContainerClient(this.logContainerName);
    const logBlobClient = logContainerClient.getBlockBlobClient(`log_${new Date().toISOString()}.txt`);
  
    const currentLogs = await logBlobClient.download(0);
    const logStream = currentLogs.readableStreamBody || "";
    let logData = "";
  
    // Append new log message
    if (logStream) {
      logStream.on('data', (chunk) => {
        logData += chunk.toString();
      });
  
      logStream.on('end', async () => {
        const updatedLogs = logData + `${new Date().toISOString()}: ${message}\n`;
        // Convert string to Buffer before uploading
        await logBlobClient.uploadData(Buffer.from(updatedLogs));
      });
    } else {
      // Convert string to Buffer before uploading
      await logBlobClient.uploadData(Buffer.from(`${new Date().toISOString()}: ${message}\n`));
    }
  }
  

  async downloadFileToResponse(fileName: string, res: Response): Promise<void> {
    const containerClient = this.blobServiceClient.getContainerClient(this.appContainerName);
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    const downloadBlockBlobResponse = await blockBlobClient.download(0);
    const stream = downloadBlockBlobResponse.readableStreamBody;
    console.log(downloadBlockBlobResponse, "download file");
    console.log(stream, "stream")

    if (!stream) {
      throw new Error('Failed to download file');
    }

    stream.pipe(res);
  }

  async deleteFile(fileName: string): Promise<void> {
    const containerClient = this.blobServiceClient.getContainerClient(this.appContainerName);
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    // Delete the blob
    const deleteBlobResponse = await blockBlobClient.deleteIfExists(); // Returns a boolean indicating if the blob was deleted
    // if (!deleteBlobResponse) {
    //   throw new Error(`File ${fileName} could not be deleted, it may not exist.`);
    // }

    console.log(`File ${fileName} deleted successfully`);
  }
}