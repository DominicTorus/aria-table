import { Module } from '@nestjs/common';
import { TfUfGluestacksService } from './tf-uf-gluestacks.service';
import { TfUfGluestacksController } from './tf-uf-gluestacks.controller';
import { TfService } from '../tf.service';

@Module({
  controllers: [TfUfGluestacksController],
  providers: [TfUfGluestacksService],
})
export class TfUfGluestacksModule {}
