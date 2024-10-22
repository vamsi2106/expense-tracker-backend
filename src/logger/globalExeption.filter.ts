import { 
  ExceptionFilter, 
  Catch, 
  ArgumentsHost, 
  HttpException, 
  HttpStatus, 
  BadRequestException, 
  UnauthorizedException 
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppLogger } from './app-logger';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly appLogger: AppLogger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    // Handle specific exception cases
    if (exception instanceof BadRequestException) {
      const validationErrors = exception.getResponse() as any;
      status = HttpStatus.BAD_REQUEST;

      // Format the error messages
      const errorMessages: string[] = [];

      Object.keys(validationErrors.message).forEach(key => {
        const messages = validationErrors.message[key];
        if (Array.isArray(messages)) {
          errorMessages.push(...messages);
        } else {
          errorMessages.push(messages);
        }
      });

      message = {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        message: errorMessages.join(' '), // Join messages into a single string
      };
    } else if (exception instanceof UnauthorizedException) {
      // Handle UnauthorizedException specifically
      status = HttpStatus.UNAUTHORIZED;
      message = {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        message: 'Unauthorized access. Please provide valid credentials.',
      };
    } else if (exception instanceof HttpException) {
      // Handle other HttpException scenarios
      message = {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        message: message ?? 'An error occurred.',
      };
    } else {
      // Handle any other errors that are not HttpExceptions
      message = {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        message: 'Internal server error',
      };
    }

    // Log the error using the AppLogger
    this.appLogger.logError(message, status, {
      path: request.url,
      method: request.method,
      body: request.body,
    });

    // Send the error response to the client
    response.status(status).json(message);
  }

  // New method to handle success responses
  handleSuccess(response: Response, data: any, message: string = 'Success') {
    const successResponse = {
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
      path: response.req.originalUrl,
      method: response.req.method,
      message: message,
      data: data,
    };

    response.status(HttpStatus.OK).json(successResponse);
  }
}
