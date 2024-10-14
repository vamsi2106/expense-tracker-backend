// import { Module } from '@nestjs/common';
// // import { ConfigModule } from '@nestjs/config';
// import { SequelizeModule } from '@nestjs/sequelize';
// // import { DatabaseConfigServic } from './config/appconfig.service';
// import { UserModule } from './user/user.module';
// // import { AppController } from './app.controller';
// // import { AppService } from './app.service';
// import { User } from 'src/entities/user.entity';

// // @Module({
// //   imports: [
// //     ConfigModule.forRoot({
// //       isGlobal: true,
// //       envFilePath: '.env',
// //     }),
// //     SequelizeModule.forRootAsync({
// //       useClass: DatabaseConfigService,
// //     }),
// //     UserModule
// //   ],
// //   providers: [DatabaseConfigService],
// // })

// @Module({
//   imports: [
//     SequelizeModule.forRoot({
//       dialect:'mssql',
//       host:"localhost",
//       port:1433,
//       // username:'',
//       // password:'',
//       database:"master",
//       dialectOptions: {
//         authentication: {
//           type: 'ntlm',
//           options: {
//             domain: "desktop-hlqu0l0",     // Domain or machine name
//             userName: "e r nagasritha", // Your Windows username
//             password: "srithag7",// Your Windows password
//           },
//         },
//         options: {
//           trustedConnection: true,
//           encrypt: false,  // Can be false for localhost
//           enableArithAbort: true,  // Prevent arithmetic errors in queries
//         },
//       },
//       models:[User],
//       autoLoadModels:true,
//       synchronize:true
//     }),
//     UserModule
//   ]
// })
// export class DbModule {}

//todays code

// db/database.module.ts
// db/database.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { DatabaseConfigService } from './mssql/connection/connection.mssql';
import { UserModule } from 'src/modules/user/user.module';
import { ExpenseDao } from './mssql/dao/expense.mgmt';
import { ExpenseModule } from 'src/modules/expenses/expense.module';
import { SchemasList } from './mssql/connection/schemas.mssql';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SequelizeModule.forRootAsync({
      useClass: DatabaseConfigService,  // Now it correctly uses the config service
    }),
    SequelizeModule.forFeature(SchemasList)
  ],
  providers: [DatabaseConfigService,ExpenseDao],
  exports : [ExpenseDao]
})
export class DbModule {}
