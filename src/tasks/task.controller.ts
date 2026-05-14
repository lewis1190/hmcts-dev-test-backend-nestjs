import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@Controller('tasks')
@UseGuards(FirebaseAuthGuard)
@ApiTags('Tasks')
@ApiBearerAuth('firebase-token')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @Post()
  @ApiOperation({
    summary: 'Create a new task',
    description: 'Creates a new task with the provided information. Requires Firebase authentication.',
  })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({
    status: 201,
    description: 'Task created successfully',
    schema: {
      example: {
        id: '123abc',
        title: 'Complete project documentation',
        description: 'Write comprehensive documentation for the API endpoints',
        status: 'Not Started',
        dueDate: '2026-06-30T23:59:59Z',
        createdAt: '2026-05-14T10:30:00Z',
        updatedAt: '2026-05-14T10:30:00Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid request body' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() dto: CreateTaskDto) {
    return this.taskService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all tasks',
    description: 'Retrieves a list of all tasks. Requires Firebase authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all tasks',
    schema: {
      example: [
        {
          id: '123abc',
          title: 'Complete project documentation',
          status: 'In Progress',
          dueDate: '2026-06-30T23:59:59Z',
          createdAt: '2026-05-14T10:30:00Z',
          updatedAt: '2026-05-14T12:00:00Z',
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getAll() {
    return this.taskService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a specific task',
    description: 'Retrieves a task by its ID. Requires Firebase authentication.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the task',
    example: '123abc',
  })
  @ApiResponse({
    status: 200,
    description: 'Task retrieved successfully',
    schema: {
      example: {
        id: '123abc',
        title: 'Complete project documentation',
        description: 'Write comprehensive documentation for the API endpoints',
        status: 'In Progress',
        dueDate: '2026-06-30T23:59:59Z',
        createdAt: '2026-05-14T10:30:00Z',
        updatedAt: '2026-05-14T12:00:00Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  getById(@Param('id') id: string) {
    return this.taskService.findById(id);
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Update task status',
    description: 'Updates the status of an existing task. Requires Firebase authentication.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the task',
    example: '123abc',
  })
  @ApiBody({ type: UpdateTaskStatusDto })
  @ApiResponse({
    status: 200,
    description: 'Task status updated successfully',
    schema: {
      example: {
        id: '123abc',
        title: 'Complete project documentation',
        description: 'Write comprehensive documentation for the API endpoints',
        status: 'In Progress',
        dueDate: '2026-06-30T23:59:59Z',
        createdAt: '2026-05-14T10:30:00Z',
        updatedAt: '2026-05-14T12:30:00Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid status value' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateTaskStatusDto) {
    return this.taskService.updateStatus(id, dto.status);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update task fields',
    description: 'Updates one or more fields of an existing task. Requires Firebase authentication.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the task',
    example: '123abc',
  })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({
    status: 200,
    description: 'Task updated successfully',
    schema: {
      example: {
        id: '123abc',
        title: 'Updated task title',
        description: 'Updated description',
        status: 'In Progress',
        dueDate: '2026-07-15T23:59:59Z',
        createdAt: '2026-05-14T10:30:00Z',
        updatedAt: '2026-05-14T14:00:00Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid request body' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.taskService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a task',
    description: 'Deletes a task by its ID. Requires Firebase authentication.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the task',
    example: '123abc',
  })
  @ApiResponse({
    status: 200,
    description: 'Task deleted successfully',
    schema: { example: { message: 'Task deleted' } },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  delete(@Param('id') id: string) {
    return this.taskService.delete(id);
  }
}
