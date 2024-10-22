import { IsString, IsDate, IsOptional, IsUUID, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRecurringTaskDto {
  @ApiPropertyOptional({
    description: 'Unique identifier for the task (Optional)',
    type: String,
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsOptional()
  id?: string; // Unique identifier for the task

  @ApiPropertyOptional({
    description: 'Name of the task (Optional)',
    example: 'Weekly Team Meeting',
  })
  @IsString()
  @IsOptional()
  name?: string; // Name of the task

  @ApiPropertyOptional({
    description: 'Optional description of the task',
    example: 'Discuss project updates and blockers',
  })
  @IsString()
  @IsOptional()
  description?: string; // Optional description of the task

  @ApiPropertyOptional({
    description: 'The date when the recurring task should start (Optional)',
    example: '2023-10-18T00:00:00.000Z',
  })
  @IsDate()
  @IsOptional()
  start_date?: Date; // The date when the recurring task should start

  @ApiPropertyOptional({
    description: 'Optional end date for the task',
    example: '2024-10-18T00:00:00.000Z',
  })
  @IsDate()
  @IsOptional()
  end_date?: Date; // Optional end date for the task

  @ApiPropertyOptional({
    description: 'Interval type (e.g., "Daily", "Weekly", "Monthly", or cron expression) (Optional)',
    example: 'Weekly',
  })
  @IsString()
  @IsOptional()
  interval?: string; // Interval type

  @ApiPropertyOptional({
    description: 'Specific time of day for execution (HH:MM:SS) (Optional)',
    example: '10:00:00',
  })
  @IsString()
  @IsOptional()
  time?: string; // Specific time of day for execution

  @ApiPropertyOptional({
    description: 'Whether the task is active or not (Optional)',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean; // Whether the task is active or not

}
