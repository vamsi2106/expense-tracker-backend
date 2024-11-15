import AppLogger from '../logger/app-logger';
import { ResponseMessages } from 'src/common/messages';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class ErrorHandler implements ExceptionFilter {
	/**
	 *Centralized error handling
	 */

	constructor(private readonly _logger: AppLogger) { }
	catch(exception: any, host: ArgumentsHost) {
		const ctx = host.switchToHttp(),
			req = ctx.getRequest<any>(),
			res = ctx.getResponse<Response>();

		let err_response: any, status: number;
		const err_desc: any = typeof exception.getResponse === 'function' ? exception.getResponse() : undefined;
		if (exception instanceof HttpException) {
			status = exception.getStatus();
			err_response = {
				status: err_desc && err_desc.code ? err_desc.code : exception.getStatus(),
				message: err_desc && err_desc.message ? err_desc.message : exception.message,
				description: err_desc && err_desc.description ? err_desc.description : undefined
			};
		} else {
			status = HttpStatus.INTERNAL_SERVER_ERROR;
			err_response = {
				status: status,
                path: req.url,
                method: req.method,
				message: ResponseMessages.UE
			};
		}
		if (status === 500) {
			this._logger.error(exception.stack, status, req.claims?.sid);
		} else {
			this._logger.log(exception.stack, status, req.claims?.sid);
		}
        let updatedErrorMessage = Array.isArray(err_response.message) ? err_response.message.join(' ') : err_response.message
		err_response.message = updatedErrorMessage;
        res.status(status).json(err_response);
	}
}
