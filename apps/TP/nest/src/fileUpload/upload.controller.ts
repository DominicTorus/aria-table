import { Body, Controller, Delete, Get, Headers, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploadService } from './upload.service';
import { diskStorage } from 'multer';
import { fileNameEditor, imageFileFilter } from './upload.utils';
import { FILE_UPLOADS_DIR } from './constants';

@Controller('image')
export class ImageUploadController {
  constructor(private readonly imageUploadService: ImageUploadService) {}

  @Post('upload')
  @UseInterceptors( FileInterceptor('file', {
          storage: diskStorage({
            filename: fileNameEditor,
            destination: FILE_UPLOADS_DIR,
          }),
          limits: {
            fileSize: 1024 * 1024 * 3,
          },
          fileFilter: imageFileFilter,
        }),
      )
  async uploadImage(@UploadedFile() file: Express.Multer.File , @Body() body) {
    const { bucketFolderame , folderPath} = body
    const imageUrl = await this.imageUploadService.uploadImage(file , bucketFolderame , folderPath);
    return { imageUrl };
  }

  @Delete("delete-asset")
  async deleteAsset(@Headers() headers) {
    const {  url } = headers
    return await this.imageUploadService.deleteAsset(url);
  }

  @Get('/getBuckets')
  async getBucketList() {
    return await this.imageUploadService.getBucketList();
  }
}