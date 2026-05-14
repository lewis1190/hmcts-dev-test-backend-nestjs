import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { TaskStatus } from './enums/task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './interfaces/task.interface';

describe('TaskController', () => {
  let taskController: TaskController;
  let taskService: TaskService;

  const mockTask: Task = {
    id: 'task-123',
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.NotStarted,
    dueDate: '2026-05-20T00:00:00Z',
    createdAt: '2026-05-14T00:00:00Z',
    updatedAt: '2026-05-14T00:00:00Z',
  };

  const mockTaskService = {
    create: jest.fn().mockResolvedValue(mockTask),
    findById: jest.fn().mockResolvedValue(mockTask),
    findAll: jest.fn().mockResolvedValue([mockTask]),
    updateStatus: jest.fn().mockResolvedValue(mockTask),
    delete: jest.fn().mockResolvedValue(void 0),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
      ],
    })
      .overrideGuard(FirebaseAuthGuard)
      .useValue({
        canActivate: () => true,
      })
      .compile();

    taskController = module.get<TaskController>(TaskController);
    taskService = module.get<TaskService>(TaskService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'New Task',
        description: 'New Description',
        status: TaskStatus.NotStarted,
        dueDate: '2026-05-20T00:00:00Z',
      };

      mockTaskService.create.mockResolvedValueOnce(mockTask);

      const result = await taskController.create(createTaskDto);

      expect(result).toEqual(mockTask);
      expect(mockTaskService.create).toHaveBeenCalledWith(createTaskDto);
    });

    it('should pass correct data to service', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test',
        status: TaskStatus.InProgress,
        dueDate: '2026-05-20T00:00:00Z',
      };

      await taskController.create(createTaskDto);

      expect(mockTaskService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test',
          status: TaskStatus.InProgress,
          dueDate: '2026-05-20T00:00:00Z',
        }),
      );
    });
  });

  describe('getById', () => {
    it('should return a task by id', async () => {
      mockTaskService.findById.mockResolvedValueOnce(mockTask);

      const result = await taskController.getById('task-123');

      expect(result).toEqual(mockTask);
      expect(mockTaskService.findById).toHaveBeenCalledWith('task-123');
    });

    it('should pass the correct id to service', async () => {
      await taskController.getById('task-456');

      expect(mockTaskService.findById).toHaveBeenCalledWith('task-456');
    });
  });

  describe('getAll', () => {
    it('should return all tasks', async () => {
      const tasks = [mockTask, { ...mockTask, id: 'task-456' }];
      mockTaskService.findAll.mockResolvedValueOnce(tasks);

      const result = await taskController.getAll();

      expect(result).toEqual(tasks);
      expect(mockTaskService.findAll).toHaveBeenCalled();
    });

    it('should return empty array when no tasks exist', async () => {
      mockTaskService.findAll.mockResolvedValueOnce([]);

      const result = await taskController.getAll();

      expect(result).toEqual([]);
    });
  });

  describe('updateStatus', () => {
    it('should update task status', async () => {
      const updateTaskStatusDto: UpdateTaskStatusDto = {
        status: TaskStatus.InProgress,
      };

      const updatedTask = { ...mockTask, status: TaskStatus.InProgress };
      mockTaskService.updateStatus.mockResolvedValueOnce(updatedTask);

      const result = await taskController.updateStatus(
        'task-123',
        updateTaskStatusDto,
      );

      expect(result).toEqual(updatedTask);
      expect(mockTaskService.updateStatus).toHaveBeenCalledWith(
        'task-123',
        TaskStatus.InProgress,
      );
    });

    it('should pass the correct id and status to service', async () => {
      const updateTaskStatusDto: UpdateTaskStatusDto = {
        status: TaskStatus.Complete,
      };

      await taskController.updateStatus('task-789', updateTaskStatusDto);

      expect(mockTaskService.updateStatus).toHaveBeenCalledWith(
        'task-789',
        TaskStatus.Complete,
      );
    });
  });

  describe('delete', () => {
    it('should delete a task', async () => {
      mockTaskService.delete.mockResolvedValueOnce(void 0);

      await taskController.delete('task-123');

      expect(mockTaskService.delete).toHaveBeenCalledWith('task-123');
    });

    it('should pass the correct id to service', async () => {
      await taskController.delete('task-456');

      expect(mockTaskService.delete).toHaveBeenCalledWith('task-456');
    });
  });
});
