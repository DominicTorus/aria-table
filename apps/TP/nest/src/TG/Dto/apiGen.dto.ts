import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class apiGenDto {
  @ApiProperty({description: 'Key', example: 'TGA:ARK:RELEASE:ABC:CG:mvp:v6'})
  @IsNotEmpty()
  key: string;
}
