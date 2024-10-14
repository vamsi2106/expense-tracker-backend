import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getTenantId(): string {
    return this.configService.get<string>('AZURE_AD_TENANT_ID');
  }

  getClientId(): string {
    return this.configService.get<string>('AZURE_AD_CLIENT_ID');
  }

  getClientSecret(): string {
    return this.configService.get<string>('AZURE_AD_CLIENT_SECRET');
  }

  getRedirectUri(): string {
    return this.configService.get<string>('AZURE_AD_REDIRECT_URI');
  }

  getDbHost(): string {
    return this.configService.get<string>('DB_HOST');
  }
  getDbPort(): string {
    return this.configService.get<string>('DB_PORT');
  }

  getDb_domain(): string {
    return this.configService.get<string>('DB_DOMAIN');
  }

  getDb_username(): string {
    return this.configService.get<string>('DB_USERNAME');
  }

  getDb_password(): string {
    return this.configService.get<string>('DB_PASSWORD');
  }

  getDb_name(): string {
    return this.configService.get<string>('DB_NAME');
  }
}
