import { Injectable } from '@nestjs/common';
import { BlobServiceClient } from '@azure/storage-blob';
import { Response } from 'express';
import { ConfigServices } from 'src/config/appconfig.service';

@Injectable()
export class AzureBlobStorageService {
  private blobServiceClient: BlobServiceClient;
  private configServices = new ConfigServices();
  private appContainerName = this.configServices.getappContainerName();
  private logContainerName = this.configServices.getLogContainerName();

  constructor() {
    this.blobServiceClient = BlobServiceClient.fromConnectionString(
      "DefaultEndpointsProtocol=https;AccountName=g7crassessment;AccountKey=MdjED2cfsaXDZ9Dn9SyULHv77O3X0rQ+6GZTn4x807y5sgxe1uUSUwxiePf9t6tgvTKbfd6Thtlb+AStxkwvtw==;EndpointSuffix=core.windows.net"
    );
    console.log(this.configServices.getConnectionString());
  }
  
  

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const containerClient = this.blobServiceClient.getContainerClient(this.appContainerName);
    const blockBlobClient = containerClient.getBlockBlobClient(file.originalname);

    const uploadBlobResponse = await blockBlobClient.uploadData(file.buffer);
    if (!uploadBlobResponse) {
      throw new Error('File upload to Azure failed');
    }

    // Log the upload event
    await this.logEvent(`Uploaded file: ${file.originalname}`);

    return blockBlobClient.url; // Return the URL of the uploaded file
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

    if (!stream) {
      throw new Error('Failed to download file');
    }

    stream.pipe(res);
  }
}
