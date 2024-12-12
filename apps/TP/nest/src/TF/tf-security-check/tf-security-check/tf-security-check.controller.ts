import { Body, Controller, Post, Req } from '@nestjs/common';
import { TfSecurityCheckService } from './tf-security-check.service';
import { tfSecurityDto } from 'src/TF/dto/tfSecurityDto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('TFUF')
export class TfSecurityCheckController {
  constructor(private readonly appService: TfSecurityCheckService) {}
  @Post('AuthorizationCheck')
  @ApiResponse({ status: 201, description: 'Security Check Completed' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async securityCheck(@Body() body: tfSecurityDto, @Req() req: any) {
    const token: string = req.headers.authorization.split(' ')[1];
    const {
      key,
      nodeName,
      isTable,
    }: { key: string; nodeName?: string; isTable?: boolean } = body;
    return await this.appService.securityCheck(key, token, nodeName, isTable);
  }
}
