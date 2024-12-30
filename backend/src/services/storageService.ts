import { S3 } from 'aws-sdk';
import crypto from 'crypto';

export class StorageService {
  private s3: S3;

  constructor() {
    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: process.env.AWS_REGION
    });
  }

  async generateDownloadLink(fileKey: string): Promise<string> {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: fileKey,
      Expires: 3600 // 1 hour
    };

    return this.s3.getSignedUrl('getObject', params);
  }

  async deleteFile(fileKey: string): Promise<void> {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: fileKey
    };

    await this.s3.deleteObject(params).promise();
  }
}