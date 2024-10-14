import * as dotenv from 'dotenv';

dotenv.config();  // Load environment variables from .env file

export class ConfigServices {
  private readonly host: string;
  private readonly port: number;
  private readonly username: string;
  private readonly password: string;
  private readonly database: string;
  private readonly domain: string;

  constructor() {
    this.host = process.env.MSSQL_HOST;
    this.port = parseInt(process.env.MSSQL_PORT, 10);
    this.username = process.env.MSSQL_USER || ''; // empty string for Windows Authentication
    this.password = process.env.MSSQL_PASSWORD || ''; // empty string for Windows Authentication
    this.database = process.env.MSSQL_DATABASE;
    this.domain = process.env.MySQL_Domain || ''; // Domain for Windows Authentication
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
}
