import {
  Controller,
  Get,
  Post,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Get authentication URL' })
  @ApiResponse({
    status: 200,
    description: 'Returns the authentication URL.',
    schema: {
      example: {
        authUrl: 'https://example.com/auth?client_id=xyz',
      },
    },
  })
  @Get()
  async getAuthUrl() {
    return this.authService.getAuthUrl();
  }

  @ApiOperation({ summary: 'Handle authentication callback' })
  @ApiBody({
    description: 'Authorization code received from login provider.',
    required: true,
    schema: {
      example: {
        code: 'abc123xyz'
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Exchanges authorization code for tokens.',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5c...',
        refreshToken: 'def456ghi',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request, missing or invalid code.' })
  @Post('callback')
  async handleCallback(@Body('code') code: string) {
    console.log('code after login', code);
    return await this.authService.exchangeCodeForTokens(code);
  }
}
