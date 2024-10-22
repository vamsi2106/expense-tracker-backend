import { Controller, Post, Body } from '@nestjs/common';
import { AzureService } from './azure.service';

@Controller('azure')
export class AzureController {
  constructor(private readonly azureService: AzureService) {}

  @Post('validate-email')
  async validateEmail(@Body('email') email: string) {
    return await this.azureService.validateEmail(email);
  }
}
