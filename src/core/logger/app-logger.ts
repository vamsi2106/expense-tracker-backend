// import { Injectable, Logger } from '@nestjs/common';
// import * as fs from 'fs';
// import * as path from 'path';

// @Injectable()
// export class AppLogger extends Logger {
//   private readonly logDirectory: string;

//   constructor() {
//     super();
//     this.logDirectory = path.join(__dirname, '../../logs'); // Ensure the logs directory exists
//     if (!fs.existsSync(this.logDirectory)) {
//       fs.mkdirSync(this.logDirectory);
//     }
//   }

//   // Log errors with status code and metadata
//   logError(message: any, statusCode: number, metadata?: any) {
//     const logMessage = `[${new Date().toISOString()}] ERROR: ${message} (Status: ${statusCode})`;
//     if (metadata) {
//       this.writeLogToFile(`${logMessage} - Metadata: ${JSON.stringify(metadata)}`);
//     } else {
//       this.writeLogToFile(logMessage);
//     }
//     super.error(logMessage);
//   }

//   private writeLogToFile(logMessage: string) {
//     const filePath = path.join(this.logDirectory, 'error.log');
//     fs.appendFileSync(filePath, `${logMessage}\n`);
//   }
// }

import { Injectable, LoggerService } from "@nestjs/common";
import { unix_ts_now } from "../utility/timestamp.utils";
import { AppConfigService } from "src/config/appConfig.services";
import { Logger,createLogger,format,transports } from "winston";
import { extensions, winstonAzureBlob } from 'winston-azure-blob';

enum WinstonLogLevel {
	ERROR = 'error',
	WARN = 'warn',
	INFO = 'info',
	HTTP = 'http',
	VERBOSE = 'verbose',
	DEBUG = 'debug',
	SILLY = 'silly'
}

@Injectable()
export default class AppLogger implements LoggerService {
	public logger: Logger;
	private readonly loggerChannels = [];
	constructor(_appConfigSvc: AppConfigService) {

		const blobCred = _appConfigSvc.get('blobConnection'),
			{ combine, timestamp, label, json } = format,
			{ Console } = transports;

		this.loggerChannels.push(new Console());
    console.log(blobCred.accountName, 'account name', blobCred.accountKey, 'account key');
		this.loggerChannels.push(
			winstonAzureBlob({
				account: {
					name: blobCred.accountName,
					key: blobCred.accountKey
				},
				containerName: blobCred.logContainerName,
				blobName: 'app-logs/expense-tracker',
				rotatePeriod: 'YYYY-MM-DD',
				bufferLogSize: 1,
				eol: '\n',
				extension: extensions.LOG,
				syncTimeout: 0
			})
		);

		this.loggerChannels.push(
			winstonAzureBlob({
				account: {

					name: blobCred.accountName,
					key: blobCred.accountKey
				},
				containerName: blobCred.logContainerName,
				level: 'error',
				blobName: 'errors/expense-tracker-api',
				rotatePeriod: 'YYYY-MM-DD',
				bufferLogSize: 1,
				eol: '\n',
				extension: extensions.LOG,
				syncTimeout: 0
			})
		);
		

		const logFormat = combine(label({ label: 'expense-tracker' }), timestamp({ format: () => unix_ts_now().toString() }), json());

		this.logger = createLogger({
			level: blobCred.logLevel || 'info',
			format: logFormat,
			transports: this.loggerChannels
		});
	}

	log(msg: any, status = 200, sid = '') {
		this.logger.log(WinstonLogLevel.INFO, { msg, status, sid });
	}
	error(msg: any, status = 500, sid = '') {
		this.logger.log(WinstonLogLevel.ERROR, { msg, status, sid });
	}
	warn(msg: any, route = '', status = 206, sid = '') {
		this.logger.log(WinstonLogLevel.WARN, { msg, route, status, sid });
	}
	debug?(msg: any, status = 200, sid = '') {
		this.logger.log(WinstonLogLevel.DEBUG, { msg, status, sid });
	}
	verbose?(msg: any, status = 200, sid = '') {
		this.logger.log(WinstonLogLevel.VERBOSE, { msg, status, sid });
	}
}
