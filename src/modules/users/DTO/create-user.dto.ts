// src/modules/users/dto/create-user.dto.ts
import { IsString, IsEmail, IsOptional } from 'class-validator';
import { Role } from 'src/core/enums/roles.enum';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  role?: Role;

  userImageUrl?: string;
}
