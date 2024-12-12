import { HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import minioClient, { minioConfig } from './minio.config';
import { CustomException } from 'src/TP/customException';

@Injectable()
export class ImageUploadService {
  private minioClient: typeof minioClient;

  constructor() {
    this.minioClient = minioClient;
  }

  async objectExists(bucketName: string, objectName: string): Promise<boolean> {
    try {
      await this.minioClient.statObject(bucketName, objectName);
      return true;
    } catch (error) {
      return false;
    }
  }

  async uploadImage(
    file: Express.Multer.File,
    bucketFolderame?: string,
    folderPath?: string,
  ): Promise<string> {
    try {
      var fileName = file.filename;
      const filePath = file.path;
      const bucketName = bucketFolderame ? bucketFolderame : 'torusfilehandler';

      // Check if bucket exists, create if not
      const bucketExists = await this.minioClient.bucketExists(bucketName);

      if (!bucketExists) {
        await this.minioClient.makeBucket(bucketName, 'public-read');
      }

      if (folderPath) {
        // Create folders and subfolders if not exists
        const folderNames = folderPath.split('/');
        let currentFolderPath = '';
        for (const folderName of folderNames) {
          currentFolderPath += folderName + '/';
          const folderExists = await this.objectExists(
            bucketName,
            currentFolderPath,
          );
          if (!folderExists) {
            await this.minioClient.putObject(bucketName, currentFolderPath, '');
          }
        }
        fileName = folderPath + '/' + fileName;
      }

      const uploadResult = await this.minioClient.putObject(
        bucketName,
        fileName,
        fs.createReadStream(filePath),
      );

      // Remove local file
      fs.unlinkSync(filePath);

      // Return uploaded file URL
      return `http://${minioConfig.endPoint}:${minioConfig.port}/${bucketName}/${fileName}`;
    } catch (error) {
      if (error instanceof CustomException) {
        throw error; // Re-throw the specific custom exception
      }
      throw new CustomException(
        'An unexpected error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteAsset(url: string) {
    try {
      if (!url) {
        throw new Error('Provide to url to delete asset');
      }
      const segments = url.split('/').slice(3);
      const bucketName = segments.shift(); // Remove the first segment (bucket name)
      const objectName = segments.join('/'); // Join the remaining segments (object path)

      await this.minioClient.removeObject(bucketName, objectName);
      return "asset deleted successfully"
    } catch (error) {
      if (error instanceof CustomException) {
        throw error; // Re-throw the specific custom exception
      }
      throw new CustomException(
        'An unexpected error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getBucketList() {
    try {
     return await this.minioClient.listBuckets();
    } catch (error) {
      console.log(error);
      
      if (error instanceof CustomException) {
        throw error; // Re-throw the specific custom exception
      }
      throw new CustomException(
        'An unexpected error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
