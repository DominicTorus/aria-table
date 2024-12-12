import { Controller } from '@nestjs/common';
import { TgUfAriaService } from './tg-uf-aria.service';

@Controller('tg-uf-aria')
export class TgUfAriaController {
  constructor(private readonly tgUfAriaService: TgUfAriaService) {}
}
