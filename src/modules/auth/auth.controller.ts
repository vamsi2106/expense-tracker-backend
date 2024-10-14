import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService:AuthService) {}

  @Get()
  async getAuthUrl(){
    return this.authService.getAuthUrl()
  }

  @Post('callback')
  async handleCallback(@Body('code') code: string) {
    return await this.authService.exchangeCodeForTokens(code)
  }
}
