export class AppConfigService {
  private readonly envConfig: { [key: string]: any } = {};

  constructor() {
    this.envConfig.app = {
			port: parseInt(process.env.APP_PORT, 10) || 5000
		};

    this.envConfig.db = {

      mssql: {
        dialect: 'mssql',
        port: parseInt(process.env.DB_PORT, 10),
        username: process.env.DB_USERNAME || '', // empty string for Windows Authentication
        password: process.env.DB_PASSWORD || '', // empty string for Windows Authentication
        database: process.env.DB_DATABASE,
        domain: process.env.DB_Domain || '', // Domain for Windows Authentication
        dbName: process.env.DB_Name || '',
        dialectOptions: {
          options: {
            encrypt: true, // Set to true if your SQL Server requires encryption
            trustServerCertificate: true, // Set to true for development only
            enableArithAbort: true, // Required for certain configurations
          },
        },
        //models:[...SchemasList],
        autoLoadModels: true,
        synchronize: true, // Use with caution in production; consider migrations instead

      }
    }

    this.envConfig.blobConnection = {
      blobConnectionString: process.env.AZURE_BLOB_CONNECTION_STRING,
      appContainerName: process.env.AZURE_APP_CONTAINER_NAME,
      logContainerName: process.env.AZURE_LOG_CONTAINER_NAME,
      accountName: process.env.AZURE_ACCOUNT_NAME,
      accountKey: process.env.AZURE_ACCOUNT_KEY,
    }

    this.envConfig.oAuth = {
      tenentId: process.env.AZURE_AD_TENANT_ID,
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      redirectUri: process.env.AZURE_AD_REDIRECT_URI,
      
    }

    

  }

  get(key: string): any {
    return this.envConfig[key];
  }
}