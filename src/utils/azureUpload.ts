import { BlobServiceClient } from '@azure/storage-blob';
import { AZURE_STORAGE_CONNECTION_STRING, BLOB_CONTAINER_NAME } from '@config';

const containerName = BLOB_CONTAINER_NAME as string;
const azureStorageConnectionString = AZURE_STORAGE_CONNECTION_STRING as string;

export const uploadToAzure = async (blobName: string, buffer: Buffer, contentType?: string) => {
  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(azureStorageConnectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    const uploadOptions = contentType ? { blobHTTPHeaders: { blobContentType: contentType } } : undefined;

    await blockBlobClient.upload(buffer, buffer.length, uploadOptions);

    return `${blockBlobClient.url}`;
  } catch (err: any) {
    console.error('Error uploading to Azure:', err);
    throw new Error(`Failed to upload blob: ${err.message}`);
  }
};

export const deleteFromAzure = async (blobName: string) => {
  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(azureStorageConnectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.delete();
  } catch (err: any) {
    console.error('Error deleting from Azure:', err);
    throw new Error(`Failed to delete blob: ${err.message}`);
  }
};

export const getAzureBlobUrl = (blobName: string) => {
  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(azureStorageConnectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    return blockBlobClient.url;
  } catch (err: any) {
    console.error('Error getting Azure blob URL:', err);
    throw new Error(`Failed to get blob URL: ${err.message}`);
  }
};

export const uploadMultipleFiles = async (files: { blobName: string; buffer: Buffer; contentType?: string }[]) => {
  try {
    const uploadPromises = files.map((file) => uploadToAzure(file.blobName, file.buffer, file.contentType));

    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (err: any) {
    console.error('Error uploading multiple files to Azure:', err);
    throw new Error(`Failed to upload multiple blobs: ${err.message}`);
  }
};
