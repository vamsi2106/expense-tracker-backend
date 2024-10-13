import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from './modules/user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './entities/user.entity';
import { DbModule } from './database/database.module';
import { ExpenseModule } from './modules/expenses/expense.module';

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,
//       envFilePath: '.env',
//     }),
//     SequelizeModule.forRootAsync({
//       useClass: DatabaseConfigService,
//     }),
//     UserModule
//   ],
//   providers: [DatabaseConfigService],
// })

@Module({
  imports: [
    // SequelizeModule.forRoot({
    //   dialect:'mssql',
    //   host:"localhost",
    //   port:1433,
    //   // username:'',
    //   // password:'',
    //   database:"master",
    //   dialectOptions: {
    //     authentication: {
    //       type: 'ntlm',
    //       options: {
    //         domain: "desktop-hlqu0l0",     // Domain or machine name
    //         userName: "e r nagasritha", // Your Windows username
    //         password: "srithag7",// Your Windows password
    //       },
    //     },
    //     options: {
    //       trustedConnection: true,
    //       encrypt: false,  // Can be false for localhost
    //       enableArithAbort: true,  // Prevent arithmetic errors in queries
    //     },
    //   },
    //   models:[User],
    //   autoLoadModels:true,
    //   synchronize:true
    // }),
    UserModule,ExpenseModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
