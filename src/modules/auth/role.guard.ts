// src/modules/auth/role.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './role.decorator';
 
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
 
  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get<string>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!requiredRole) {
      return true; // If no role is specified, allow access
    }
 
    const request = context.switchToHttp().getRequest();
    const user = request.user; // User is attached to the request by JwtAuthGuard
 
    if (!user || !user.role) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }
 
    if (user.role !== requiredRole) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }
 
    return true; // User has the required role
  }
}
 