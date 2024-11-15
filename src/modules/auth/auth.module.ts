// src/modules/auth/auth.module.ts
import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AppService } from 'src/modules/app/app.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthService } from './jwtAuth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AbstractAuth } from './auth.abstract';
@Global()
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'A', // Use environment variable for production
      signOptions: { expiresIn: '72h' }, // Token expiration time
    }),
  ],
  controllers: [AuthController],
  providers: [
    AppService,
    {
      provide: AbstractAuth,
      useClass: AuthService
    },
    JwtAuthService, JwtStrategy],
})
export class AuthModule { }
