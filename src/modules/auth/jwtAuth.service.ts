// src/modules/auth/jwtAuth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthService {
  constructor(private jwtService: JwtService) {}

  async generateJwt(user: any) {
    // const payload = { email: user.email, role: user.role };
    // console.log(user);
    return await this.jwtService.sign(user);
  }

  // async verifyToken(token:string){
  //   const payload = await this.jwtService.verify(token)
  //   // console.log("Payload in verify jwt", payload)
  //   return payload
  // }
}
