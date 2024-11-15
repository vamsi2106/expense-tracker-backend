import { AppConfigService } from 'src/config/appConfig.services';// Adjust the import according to your project
import { Sequelize } from 'sequelize-typescript';
import { msSqlConstants } from './constants.mssql';
import { models } from './models.connection.mssql';
import AppLogger from 'src/core/logger/app-logger';

export const DatabaseConfigService =[
  {
  provide : msSqlConstants.SequelizeProvider,
  inject: [AppConfigService, AppLogger],
  useFactory: async (configDetails: AppConfigService, logger:AppLogger): Promise<any> => {
    const sequelize: Sequelize = null;
    try {
      // Fetch the DB config from AppConfigService
      const dbConfig = configDetails.get('db').mssql,
      sequelize = new Sequelize({
        ...dbConfig
      });
      
      // Try to authenticate the connection
      sequelize.addModels([...models]);
				await sequelize.authenticate();
      logger.log('Database connection established successfully');

      // Return Sequelize configuration options for NestJS
      return sequelize;
    } catch (error) {
      logger.error('Database connection error:', error);
      throw new Error('Failed to connect to the database');
    }
  },
}];
