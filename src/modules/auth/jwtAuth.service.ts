// src/modules/auth/jwtAuth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthService {
  constructor(private jwtService: JwtService) {}

  async generateJwt(user: any) {
    return await this.jwtService.sign(user);
  }
}
