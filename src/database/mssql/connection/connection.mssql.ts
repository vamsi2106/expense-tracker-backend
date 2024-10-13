import { SequelizeModuleOptions, SequelizeOptionsFactory } from '@nestjs/sequelize';
import { ConfigServices } from 'src/config/appconfig.service';
import { SchemasList } from './schemas.mssql';

export class DatabaseConfigService implements SequelizeOptionsFactory {
  
  private configService: ConfigServices;

  constructor() {
    // Manually create an instance of ConfigServices
    this.configService = new ConfigServices();
  }

  createSequelizeOptions(): SequelizeModuleOptions {
    return {
      dialect: 'mssql',
      host: this.configService.getHost(),
      port: this.configService.getPort(),
      username: this.configService.getUsername(),
      password: this.configService.getPassword(),
      database: this.configService.getDatabase(),
      models : SchemasList,
      dialectOptions: {
        authentication: {
          type: 'ntlm',
          options: {
            domain: this.configService.getDomain(),
            userName: this.configService.getUsername(),
            password: this.configService.getPassword(),
          },
        },
        options: {
          trustedConnection: true,
          encrypt: false,
          enableArithAbort: true,
        },
      },
      autoLoadModels: true,
      synchronize: true,
    };
  }
}
