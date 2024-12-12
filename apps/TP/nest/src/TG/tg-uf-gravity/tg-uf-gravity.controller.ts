import { Controller } from '@nestjs/common';
import { TgUfGravityService } from './tg-uf-gravity.service';

@Controller('tg-uf-gravity')
export class TgUfGravityController {
  constructor(private readonly tgUfAriaService: TgUfGravityService) {}
}
