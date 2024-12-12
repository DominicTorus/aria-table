import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class tfSecurityDto {
    @IsNotEmpty()
    key: string;
    nodeName?: string;
    isTable?: boolean
}
