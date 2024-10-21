import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from 'src/core/enums/roles.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'JohnDoe', description: 'Username of the user' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Email of the user' })
  @IsEmail()
  email: string;

  @ApiProperty({ enum: Role, description: 'Role of the user' })
  @IsEnum(Role)
  role: Role;

  @ApiPropertyOptional({
    example: 'http://example.com/userimage.jpg',
    description: 'Optional image URL for the user',
  })
  @IsOptional()
  @IsString()
  userImageUrl?: string;
}
