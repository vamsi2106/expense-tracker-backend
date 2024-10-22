import { 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  IsEnum, 
  IsBoolean, 
  IsDate 
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotPastDate } from 'src/utility/dateValidation'; // Import your custom validator
import { Type } from 'class-transformer';

export enum RecurringInterval {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  HOURLY = 'hour',
  MINUTE = 'minute',
}

export class UpdateRecurringTaskDto {

  @ApiProperty({
    description: 'Name of the task',
    type: String,
    example: 'Daily Standup Meeting',
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string.' })
  name?: string;

  @ApiProperty({
    description: 'Optional description of the task',
    type: String,
    example: 'A daily meeting to discuss project updates',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string.' })
  description?: string;

  @ApiProperty({
    description: 'The date when the recurring task should start in "YYYY-MM-DD" format',
    type: String,
    format: 'date',
    example: '2024-02-20',
  })
  @IsOptional()
  @IsDate({ message: 'Start date must be a valid date.' })
  @Type(() => Date)  // Automatically converts the incoming string to a Date object
  @IsNotPastDate({ message: 'Start date should not be in the past.' })  // Custom validator to check future dates
  start_date?: Date;

  @ApiProperty({
    description: 'Optional end date for the task in "YYYY-MM-DD" format',
    type: String,
    format: 'date',
    example: '2024-12-31',
    required: false,
  })
  @IsOptional()
  @IsDate({ message: 'End date must be a valid date.' })
  @Type(() => Date)  // Converts the incoming string to a Date object
  @IsNotPastDate({ message: 'End date should not be in the past.' })  // Custom validator to check future dates
  end_date?: Date;

  @ApiProperty({
    description: 'Interval type (e.g., "Daily", "Weekly", "Monthly")',
    type: String,
    enum: RecurringInterval,
    example: 'Daily',
  })
  @IsOptional()
  @IsEnum(RecurringInterval, { message: `Interval must be one of: ${Object.values(RecurringInterval).join(', ')}` })
  interval?: RecurringInterval;

  @ApiProperty({
    description: 'Specific time of day for execution (HH:MM:SS)',
    type: String,
    example: '09:00:00',
  })
  @IsOptional()
  @IsString({ message: 'Time must be a string in HH:MM:SS format.' })
  time?: string;

  @ApiProperty({
    description: 'Whether the task is active or not',
    type: Boolean,
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'is_active must be a boolean.' })
  is_active?: boolean;
}
