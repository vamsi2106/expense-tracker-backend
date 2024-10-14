import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AppService } from 'src/modules/app/app.service';

@Module({
  controllers: [AuthController],
  providers: [AppService,AuthService],
})
export class AuthModule {}
