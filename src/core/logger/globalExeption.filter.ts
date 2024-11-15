// import { 
//   ExceptionFilter, 
//   Catch, 
//   ArgumentsHost, 
//   HttpException, 
//   HttpStatus, 
//   BadRequestException, 
//   UnauthorizedException 
// } from '@nestjs/common';
// import { Request, Response } from 'express';
// import { AppLogger } from './app-logger';
//import { ResponseMessages } from 'src/common/messages';

// import {
//   ExceptionFilter,
//   Catch,
//   ArgumentsHost,
//   HttpException,
//   HttpStatus,
//   BadRequestException,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { Request, Response } from 'express';
// import { AppLogger } from './app-logger';
// import { ResponseMessages } from 'src/common/messages';

// @Catch()
// export class GlobalExceptionFilter implements ExceptionFilter {
//   constructor(private readonly appLogger: AppLogger) {}

//   catch(exception: unknown, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const request = ctx.getRequest<Request>();

//     // Default to internal server error if the exception is not an HttpException
//     let status =
//       exception instanceof HttpException
//         ? exception.getStatus()
//         : HttpStatus.INTERNAL_SERVER_ERROR;

//     let errorResponse: any =
//       exception instanceof HttpException
//         ? exception.getResponse()
//         : 'Internal server error';

//     // Handle error response as string or object
//     if (typeof errorResponse === 'string') {
//       errorResponse = { message: errorResponse }; // Wrap string in an object
//     }

//     // Ensure the final error response structure
//     const errorMessage = {
//       statusCode: status,
//       timestamp: new Date().toISOString(),
//       path: request.url,
//       method: request.method,
//       // Ensure 'message' comes from the response and not 'response'
//       message: errorResponse.message || errorResponse.response || 'An error occurred.',
//     };

//     if (exception instanceof BadRequestException) {
//       const validationErrors = (errorResponse as any).message;
//       errorMessage.message = Array.isArray(validationErrors)
//         ? validationErrors.join(' ')
//         : validationErrors;
//     }

//     if (exception instanceof UnauthorizedException) {
//       errorMessage.message = ResponseMessages.UA;
//     }

//     // Log the error using the custom logger
//     this.appLogger.logError(errorMessage, status, {
//       path: request.url,
//       method: request.method,
//       body: request.body,
//     });

//     // Return the cleaned-up error message
//     response.status(status).json(errorMessage);
//     console.log(errorMessage,status);
//   }

//   async handleSuccess(response: Response, data: any, message: string = 'Success') {
//     const successResponse = {
//       statusCode: HttpStatus.OK,
//       timestamp: new Date().toISOString(),
//       path: response.req.originalUrl,
//       method: response.req.method,
//       message: message,
//       data: data,
//     };

//     response.status(HttpStatus.OK).json(successResponse);
//   }
// }

//claud ai code
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
  UnauthorizedException,
  ValidationError,
} from '@nestjs/common';
import { Request, Response } from 'express';
import AppLogger from './app-logger';
import { ResponseMessages } from 'src/common/messages';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly appLogger: AppLogger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorMessage: any = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: 'Internal server error',
      error: null
    };

    try {
      // Handle different types of exceptions
      if (exception instanceof HttpException) {
        status = exception.getStatus();
        const errorResponse = exception.getResponse();

        if (typeof errorResponse === 'string') {
          errorMessage.message = errorResponse;
        } else if (typeof errorResponse === 'object') {
          const errorObj = errorResponse as any;
          errorMessage.message = errorObj.message || errorObj.error || 'An error occurred';
          errorMessage.error = errorObj.error || null;
          
          // Handle validation errors specifically
          if (Array.isArray(errorObj.message)) {
            errorMessage.message = this.formatValidationErrors(errorObj.message);
            errorMessage.error = 'Validation Error';
          }
        }
      } else if (this.isDatabaseError(exception)) {
        // Handle database errors
        status = HttpStatus.BAD_REQUEST;
        errorMessage.message = 'Database operation failed';
        errorMessage.error = 'Database Error';
        
        // Log the actual error for debugging but don't send to client
        this.appLogger.log({
          ...errorMessage,
          detail: (exception as any).detail,
          code: (exception as any).code
        }, status, 
        // {
        //   path: request.url,
        //   method: request.method,
        //   body: request.body,
        // }
      );
      } else if (exception instanceof Error) {
        // Handle standard JavaScript errors
        errorMessage.message = exception.message;
        errorMessage.error = exception.name;
      }

      // Update status code in error message
      errorMessage.statusCode = status;

      // Special case handling
      if (exception instanceof BadRequestException) {
        const validationErrors = (exception.getResponse() as any).message;
        errorMessage.message = Array.isArray(validationErrors)
          ? this.formatValidationErrors(validationErrors)
          : validationErrors;
        errorMessage.error = 'Validation Error';
      }

      if (exception instanceof UnauthorizedException) {
        errorMessage.message = ResponseMessages.UA;
        errorMessage.error = 'Unauthorized';
      }

      // Remove sensitive information from error response
      this.sanitizeErrorResponse(errorMessage);

      // Log the error
      this.appLogger.log(
        {
          ...errorMessage,
          originalError: exception instanceof Error ? exception.stack : null
        },
        status,
        // {
        //   path: request.url,
        //   method: request.method,
        //   body: this.sanitizeRequestBody(request.body),
        // }
      );

    } catch (error) {
      // If error handling itself fails, return a generic error
      errorMessage = {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
        message: 'An unexpected error occurred',
        error: 'Internal Server Error'
      };
    }

    // Send response
    response.status(status).json(errorMessage);
  }

  private isDatabaseError(error: any): boolean {
    return (
      error?.name === 'QueryFailedError' ||
      error?.code?.startsWith('23') || // PostgreSQL error codes
      error?.errno === 1062 || // MySQL duplicate entry
      (error?.message && error?.message.includes('duplicate key'))
    );
  }

  private formatValidationErrors(errors: any[]): string {
    if (!Array.isArray(errors)) {
      return 'Validation failed';
    }

    return errors
      .map(error => {
        if (typeof error === 'string') {
          return error;
        }
        if (error.constraints) {
          return Object.values(error.constraints);
        }
        return null;
      })
      .filter(Boolean)
      .flat()
      .join('. ');
  }

  private sanitizeErrorResponse(errorResponse: any): void {
    // Remove sensitive fields
    const sensitiveFields = ['password', 'token', 'secret', 'key'];
    for (const field of sensitiveFields) {
      if (errorResponse[field]) {
        delete errorResponse[field];
      }
    }
  }

  private sanitizeRequestBody(body: any): any {
    if (!body) return body;
    
    const sanitizedBody = { ...body };
    const sensitiveFields = ['password', 'token', 'secret', 'key'];
    
    for (const field of sensitiveFields) {
      if (sanitizedBody[field]) {
        sanitizedBody[field] = '[REDACTED]';
      }
    }
    
    return sanitizedBody;
  }

  async handleSuccess(response: Response, data: any, message: string = 'Success') {
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