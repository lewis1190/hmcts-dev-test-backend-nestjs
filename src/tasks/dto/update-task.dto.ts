import { IsOptional, IsString, IsISO8601, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '../enums/task-status.enum';

export class UpdateTaskDto {
  @ApiPropertyOptional({
    description: 'The title of the task',
    example: 'Complete project documentation',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'A detailed description of the task',
    example: 'Write comprehensive documentation for the API endpoints',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'The current status of the task',
    enum: TaskStatus,
    example: TaskStatus.InProgress,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({
    description: 'The due date for the task in ISO 8601 format',
    example: '2026-06-30T23:59:59Z',
  })
  @IsOptional()
  @IsISO8601()
  dueDate?: string;
}
