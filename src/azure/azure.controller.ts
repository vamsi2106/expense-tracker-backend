import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AzureService } from './azure.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth-guard.guard';
import { RoleGuard } from 'src/modules/auth/role.guard';
import { Roles } from 'src/modules/auth/role.decorator';
import { Role } from 'src/core/enums/roles.enum';

@Controller('azure')
export class AzureController {
  constructor(private readonly azureService: AzureService) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.admin)    
  @Post('validate-email')
  async validateEmail(@Body('email') email: string) {
    return await this.azureService.validateEmail(email);
  }
}
