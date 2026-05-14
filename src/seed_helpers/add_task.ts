import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';
import { UpdateTaskStatusDto } from 'src/tasks/dto/update-task-status.dto';
import { TaskStatus } from 'src/tasks/enums/task-status.enum';
import { TaskService } from 'src/tasks/task.service';

@Controller('seed-tasks')
export class TempTaskController {
  constructor(private readonly taskService: TaskService) { }

  @Post()
  create() {
    const testDTO: CreateTaskDto = {
      title: 'Test Task',
      description: 'This is a test task created by the seed script.',
      status: TaskStatus.NotStarted,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Due in 7 days
    };
    return this.taskService.create(testDTO);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.taskService.findById(id);
  }

  @Get()
  getAll() {
    return this.taskService.findAll();
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateTaskStatusDto) {
    return this.taskService.updateStatus(id, dto.status);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.taskService.delete(id);
  }
}
