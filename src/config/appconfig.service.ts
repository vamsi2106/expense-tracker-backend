import * as dotenv from 'dotenv';

dotenv.config();  // Load environment variables from .env file

export class ConfigServices {
  private readonly host: string;
  private readonly port: number;
  private readonly username: string;
  private readonly password: string;
  private readonly database: string;
  private readonly domain: string;
  private readonly serverPort: number;
  private readonly blobConnectionString: string;
  private readonly appContainerName: string;
  private readonly logContainerName: string;
  private readonly servicePort: string;
  private readonly accountKey : string;
  private readonly accountName :string

  constructor() {
    this.host = process.env.DB_HOST;
    this.port = parseInt(process.env.DB_PORT, 10);
    this.username = process.env.DB_USERNAME || ''; // empty string for Windows Authentication
    this.password = process.env.DB_PASSWORD || ''; // empty string for Windows Authentication
    this.database = process.env.DB_DATABASE;
    this.domain = process.env.DB_Domain || ''; // Domain for Windows Authentication
    this.serverPort = parseInt(process.env.Server_Port, 10);
    this.blobConnectionString = process.env.AZURE_BLOB_CONNECTION_STRING;
    this.appContainerName = process.env.AZURE_APP_CONTAINER_NAME;
    this.logContainerName = process.env.AZURE_LOG_CONTAINER_NAME;
    this.servicePort = process.env.Server_Port;
    this.accountName = process.env.AZURE_ACCOUNT_NAME;
    this.accountKey = process.env.AZURE_ACCOUNT_KEY;
  }

  getAccountName() { 
    return this.accountName;
  }

  getAccountKey(){
    return this.accountKey;
  }

  getDialectOptions() {
    return {
      domain: this.domain,
      userName: this.username,
      password: this.password,
    }
  }

  getSetUpOptions(){
    return {
      host:this.host,
      port : this.port,
      database: this.database
    }
  }

  getServicePort(): string {
    return this.servicePort;
  }

  getHost(): string {
    return this.host;
  }

  getPort(): number {
    return this.port;
  }

  getUsername(): string {
    return this.username;
  }

  getPassword(): string {
    return this.password;
  }

  getDatabase(): string {
    return this.database;
  }

  getDomain(): string {
    return this.domain;
  }

  getServerPort(): number {
    return this.serverPort;
  }

  getConnectionString(): string {
    return this.blobConnectionString;
  }

  getappContainerName(): string {
    return this.appContainerName;
  }

  getLogContainerName(): string {
    return this.logContainerName;
  }
}