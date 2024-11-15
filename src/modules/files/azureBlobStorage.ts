import { Injectable } from '@nestjs/common';
import { BlobServiceClient } from '@azure/storage-blob';
import { sasUrl } from './sasToken';
import { AbstractAzureBlobStorage } from './abstract/azureBlobStorage.abstract';
import { AppConfigService } from 'src/config/appConfig.services';

@Injectable()
export class AzureBlobStorageService implements AbstractAzureBlobStorage {
  private blobServiceClient: BlobServiceClient;
 
  private blobConnections: any;
  private appContainerName : string;
  private logContainerName : string;
  private connectionString : string;

  constructor(private configServices: AppConfigService) {
    this.blobConnections = this.configServices.get('blobConnection');
    this.appContainerName = this.blobConnections.appContainerName;
    
    this.logContainerName = this.blobConnections.logContainerName;
    this.connectionString = this.blobConnections.blobConnectionString;

    this.blobServiceClient = BlobServiceClient.fromConnectionString(this.connectionString);
  }



  async uploadFile(file: Express.Multer.File): Promise<string> {    
    const containerClient = this.blobServiceClient.getContainerClient(this.appContainerName);
    const blockBlobClient = containerClient.getBlockBlobClient(file.originalname);

    const uploadBlobResponse = await blockBlobClient.uploadData(file.buffer);
    if (!uploadBlobResponse) {
      throw new Error('File upload to Azure failed');
    }

    // Log the upload event
    let fileLink = sasUrl(file.originalname);
    return fileLink; // Return the URL of the uploaded file
  }

  async logEvent(message: string) {
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


  async deleteFile(fileName: string): Promise<void> {
    const containerClient = this.blobServiceClient.getContainerClient(this.appContainerName);
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    // Delete the blob
    const deleteBlobResponse = await blockBlobClient.deleteIfExists(); // Returns a boolean indicating if the blob was deleted
    // if (!deleteBlobResponse) {
    //   throw new Error(`File ${fileName} could not be deleted, it may not exist.`);
    // }
  }
}