import { Body, Controller, Post, Req, UseGuards, UsePipes } from '@nestjs/common';
import { TgDfService } from './tg-df.service';
import { DFGenDto } from './Dto/df.dto';

@Controller('DFCodeGeneration')
export class TgDfController {
  constructor(private readonly codeGenerateService: TgDfService) {}

  @Post()
   /**
   * Asynchronously creates a new code based on the provided key.
   *
   * @param {erApiSecurityGenDto} body - The body of the request containing the key.
   * @param {Request} request - The request object.
   * @return {Promise<any>} A promise that resolves to the generated code.
   */
  async DFcreateCode(@Body() body: DFGenDto,@Req() req:any): Promise<any> {
    const { key,dataBase,gitRepo } = body;
    const token = req.headers.authorization.split(' ')[1];
    return await this.codeGenerateService.DFcreateCode(key,token,dataBase,gitRepo);
  }
}
