import { S3 } from 'aws-sdk';

export class StorageService {
  private s3: S3;

  constructor() {
    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: process.env.AWS_REGION
    });
  }

  async generateDownloadLink(fileKey: string, expirySeconds: number): Promise<string> {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: fileKey,
      Expires: expirySeconds
    };

    return await this.s3.getSignedUrlPromise('getObject', params);
  }

  async deleteFile(fileKey: string): Promise<void> {
    try {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: fileKey
      };

      await this.s3.deleteObject(params).promise();
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Failed to delete file');
    }
  }

  async deleteFiles(fileKeys: string[]): Promise<void> {
    try {
      const deletePromises = fileKeys.map(fileKey => this.deleteFile(fileKey));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error deleting files:', error);
      throw new Error('Failed to delete files');
    }
  }
}