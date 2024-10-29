import { BlobServiceClient, generateBlobSASQueryParameters, StorageSharedKeyCredential, BlobSASPermissions } from '@azure/storage-blob';
import { ConfigServices } from "src/config/appconfig.service";

export function sasUrl(blobName: string) {
    const customService = new ConfigServices(); // Fixed typo
    const account = customService.getAccountName();
    const accountKey = customService.getAccountKey();
    const containerName = customService.getappContainerName();

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
