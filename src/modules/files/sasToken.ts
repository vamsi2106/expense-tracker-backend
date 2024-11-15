import { BlobServiceClient, generateBlobSASQueryParameters, StorageSharedKeyCredential, BlobSASPermissions } from '@azure/storage-blob';
//import { ConfigServices } from "src/config/appconfig.service";
import { AppConfigService } from 'src/config/appConfig.services';

export function sasUrl(blobName: string) {
    const customService = new AppConfigService(); 
    let blobDetails = customService.get('blobConnection')// Fixed typo
    const account = blobDetails.accountName;
    const accountKey = blobDetails.accountKey;
    const containerName = blobDetails.containerName;

    const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);

    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 30); // Set expiration time

    // Define permissions using BlobSASPermissions
    const permissions = new BlobSASPermissions();
    permissions.read = true; // Set read permission

    // Options for the SAS Token
    const sasOptions = {
        containerName,
        blobName,
        permissions, // Permissions must be set via BlobSASPermissions
        expiresOn: expiryDate,
    };

    // Generate SAS token
    const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString();

    // Construct the Blob URL with the SAS token
    const blobUrl = `https://${account}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;

    console.log(blobUrl); // Use this URL to access the blob with SAS
    return blobUrl;
}
