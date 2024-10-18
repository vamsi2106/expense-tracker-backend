import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AppLogger extends Logger {
  private readonly logDirectory: string;

  constructor() {
    super();
    this.logDirectory = path.join(__dirname, '../../logs'); // Ensure the logs directory exists
    if (!fs.existsSync(this.logDirectory)) {
      fs.mkdirSync(this.logDirectory);
    }
  }

  // Log errors with status code and metadata
  logError(message: string, statusCode: number, metadata?: any) {
    const logMessage = `[${new Date().toISOString()}] ERROR: ${message} (Status: ${statusCode})`;
    if (metadata) {
      this.writeLogToFile(`${logMessage} - Metadata: ${JSON.stringify(metadata)}`);
    } else {
      this.writeLogToFile(logMessage);
    }
    super.error(logMessage);
  }

  private writeLogToFile(logMessage: string) {
    const filePath = path.join(this.logDirectory, 'error.log');
    fs.appendFileSync(filePath, `${logMessage}\n`);
  }
}
