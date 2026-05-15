import { IsNotEmpty, IsOptional, IsString, IsISO8601, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '../enums/task-status.enum';

export class CreateTaskDto {
  @ApiProperty({
    description: 'The title of the task',
    example: 'Complete project documentation',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'A detailed description of the task',
    example: 'Write comprehensive documentation for the API endpoints',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'The current status of the task',
    enum: TaskStatus,
    example: TaskStatus.NotStarted,
  })
  @IsNotEmpty()
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @ApiProperty({
    description: 'The due date for the task in ISO 8601 format',
    example: '2026-06-30T23:59:59Z',
  })
  @IsNotEmpty()
  @IsISO8601()
  dueDate: string;
}
