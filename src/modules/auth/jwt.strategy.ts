// src/modules/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Ensure token is not expired
      secretOrKey: 'A',
    });
  }

  async validate(payload: any) {
    console.log('Payload in Validate Strategy', payload);
    return { email: payload.email, role: payload.role };
  }
}
