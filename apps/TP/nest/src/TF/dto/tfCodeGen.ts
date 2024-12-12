import { IsNotEmpty } from 'class-validator';

export class TFCodeGenDTO  {
    @IsNotEmpty()
    key: string;
}
