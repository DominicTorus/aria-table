import { Controller } from '@nestjs/common';
import { TfUfGluestacksService } from './tf-uf-gluestacks.service';

@Controller('tf-uf-gluestacks')
export class TfUfGluestacksController {
  constructor(private readonly tfUfGluestacksService: TfUfGluestacksService) {}
}
