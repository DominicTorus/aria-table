import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class uploadHandlerDto {
  @ApiProperty({description: 'Key', example: 'TGA:ABKUF:BUILD:ABC:mvp:bank:v2:Events:Grouprow4:ButtonSave:v1'})
  @IsNotEmpty()
  key: string;
}
