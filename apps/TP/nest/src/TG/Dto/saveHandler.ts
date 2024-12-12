import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class saveHandlerDto {
  @ApiProperty({description: 'Key', example: 'TGA:ABKUF:BUILD:ABC:mvp:bank:v2:Events:Grouprow4:ButtonSave:v1'})
  @IsNotEmpty()
  key: string;

  @ApiProperty({description: 'value'})
  @IsNotEmpty()
  value: any;

  @ApiProperty({description: 'path', example: 'params.request'})
  @IsNotEmpty()
  path: string;
}
