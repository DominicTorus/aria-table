import { Body, Controller, Param, Post, Query, Req, UnauthorizedException } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { TfService } from './tf.service';
import { TFCodeGenDTO } from './dto/tfCodeGen';

@Controller('TF')
export class TfController {
  constructor(private readonly tfService: TfService) {}

  @Post('codeGeneration')
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  // @UseGuards(securityGuard1)
  async codeGeneration(@Body() body: TFCodeGenDTO, @Query('platform') platform: string, @Req() req): Promise<any> {
    let { key } = body;
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization token is required');
    }
    const token = req.headers.authorization.split(' ')[1];
    return this.tfService.codeGeneration(platform, key, token);
  }
}
