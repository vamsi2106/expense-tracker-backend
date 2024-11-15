import { Global, Module } from '@nestjs/common';
import { DatabaseConfigService } from './mssql/connection/connection.mssql';
import { DatabaseService } from './database.service';
import { ProviderDaoList } from './mssql/connection/daoProviders.mssql';
import { mssqlModalProvider } from './mssql/connection/models.connection.mssql';

@Module({
  //imports: [SequelizeModule.forFeature(SchemasList)],
  imports: [    ],
  providers: [
    DatabaseService,
    ...DatabaseConfigService,
    ...mssqlModalProvider,
    ...ProviderDaoList,
  ],
  exports: [
    DatabaseService,
    ...DatabaseConfigService,
    ...mssqlModalProvider,
    ...ProviderDaoList,
  ],
})
export class DbModule { }
