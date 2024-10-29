import { Module } from '@nestjs/common';
import { GlobalExceptionFilter } from './globalExeption.filter';
import { AppLogger } from './app-logger';

@Module({
  providers: [GlobalExceptionFilter,AppLogger],
  exports: [GlobalExceptionFilter,AppLogger],  // Export it to be used in other modules
})

export class GlobalModule {}
