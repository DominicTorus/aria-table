import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { TgService } from './tg.service';
import {  ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { apiGenDto } from './Dto/apiGen.dto';
import { string } from 'valibot';

@ApiTags('TG')
@Controller()
export class TgController {
  constructor(private readonly tgService: TgService) {}

  @Post('codeGeneration')
  @ApiResponse({ status: 201, description: 'Code Generation Completed'})
  @ApiResponse({ status: 400, description: 'Bad Request'})
  @ApiResponse({ status: 500, description: 'Internal Server Error'})
  @ApiOkResponse({ type: string })
  // @UseGuards(securityGuard1)
  async codeGeneration(@Body() body: apiGenDto,@Req() req): Promise<any> {
    const { key } = body;
    const token = req.headers.authorization.split(' ')[1];
    return this.tgService.codeGeneration(key, token);
  }
}
