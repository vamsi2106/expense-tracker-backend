// src/modules/sendgrid/sendgrid.module.ts
import { Module } from '@nestjs/common';
import { SendGridModule } from '@anchan828/nest-sendgrid';

@Module({
  imports: [
    SendGridModule.forRoot({
      apikey:
        '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',
    }),
  ],
  exports: [SendGridModule],
})
export class CustomSendGridModule {}
