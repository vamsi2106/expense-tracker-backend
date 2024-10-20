import { SequelizeModule, SequelizeModuleOptions } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SchemasList } from './schemas.mssql';

export const DatabaseConfigService = SequelizeModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService): SequelizeModuleOptions => ({
    dialect: 'mssql',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    database: configService.get<string>('DB_NAME'),
    dialectOptions: {
      authentication: {
        type: 'ntlm',
        options: {
          domain: configService.get<string>('DB_DOMAIN'),
          userName: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
        },
      },
      options: {
        encrypt: true, // Set to true if your SQL Server requires encryption
        trustServerCertificate: true, // Set to true for development only
        enableArithAbort: true, // Required for certain configurations
      },
    },
    models:[...SchemasList],
    autoLoadModels: true,
    synchronize: true, // Use with caution in production; consider migrations instead
  }),
});
