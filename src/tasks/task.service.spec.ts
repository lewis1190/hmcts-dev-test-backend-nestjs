import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TaskService } from './task.service';
import { FirebaseService } from '../firebase/firebase.service';
import { TaskStatus } from './enums/task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';

describe('TaskService', () => {
  let taskService: TaskService;
  let firebaseService: FirebaseService;

  // Mock Firebase Firestore
  const mockDocSnapshot = {
    exists: true,
    id: 'task-123',
    data: () => ({
      title: 'Test Task',
      description: 'Test Description',
      status: TaskStatus.NotStarted,
      dueDate: '2026-05-20T00:00:00Z',
      createdAt: '2026-05-14T00:00:00Z',
      updatedAt: '2026-05-14T00:00:00Z',
    }),
  };

  const mockQuerySnapshot = {
    docs: [mockDocSnapshot],
    empty: false,
  };

  const mockDocRef = {
    add: jest.fn(),
    get: jest.fn().mockResolvedValue(mockDocSnapshot),
    update: jest.fn().mockResolvedValue({}),
    delete: jest.fn().mockResolvedValue({}),
    doc: jest.fn(),
  };

  const mockCollection = {
    add: jest.fn(),
    get: jest.fn().mockResolvedValue(mockQuerySnapshot),
    doc: jest.fn().mockReturnValue(mockDocRef),
  };

  const mockFirestore = {
    collection: jest.fn().mockReturnValue(mockCollection),
  };

  const mockAdmin = {
    firestore: jest.fn().mockReturnValue(mockFirestore),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: FirebaseService,
          useValue: {
            admin: mockAdmin,
          },
        },
      ],
    }).compile();

    taskService = module.get<TaskService>(TaskService);
    firebaseService = module.get<FirebaseService>(FirebaseService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new task and return it with id', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.NotStarted,
        dueDate: '2026-05-20T00:00:00Z',
      };

      const mockRef = { id: 'task-123' };
      mockCollection.add.mockResolvedValueOnce(mockRef);

      const result = await taskService.create(createTaskDto);

      expect(result).toHaveProperty('id', 'task-123');
      expect(result).toHaveProperty('title', 'Test Task');
      expect(result).toHaveProperty('description', 'Test Description');
      expect(result).toHaveProperty('status', TaskStatus.NotStarted);
      expect(result).toHaveProperty('dueDate', '2026-05-20T00:00:00Z');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
      expect(mockCollection.add).toHaveBeenCalled();
    });

    it('should set createdAt and updatedAt timestamps', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.InProgress,
        dueDate: '2026-05-20T00:00:00Z',
      };

      const mockRef = { id: 'task-456' };
      mockCollection.add.mockResolvedValueOnce(mockRef);

      const result = await taskService.create(createTaskDto);

      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
      expect(result.createdAt).toEqual(result.updatedAt);
    });

    it('should create task without optional description', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        status: TaskStatus.Complete,
        dueDate: '2026-05-20T00:00:00Z',
      };

      const mockRef = { id: 'task-789' };
      mockCollection.add.mockResolvedValueOnce(mockRef);

      const result = await taskService.create(createTaskDto);

      expect(result.title).toBe('Test Task');
      expect(result.status).toBe(TaskStatus.Complete);
    });
  });

  describe('findById', () => {
    it('should return a task by id', async () => {
      const mockDocRefFound = {
        get: jest.fn().mockResolvedValueOnce(mockDocSnapshot),
      };
      mockCollection.doc.mockReturnValueOnce(mockDocRefFound);

      const result = await taskService.findById('task-123');

      expect(result).toHaveProperty('id', 'task-123');
      expect(result).toHaveProperty('title', 'Test Task');
      expect(mockCollection.doc).toHaveBeenCalledWith('task-123');
    });

    it('should throw NotFoundException when task does not exist', async () => {
      const nonExistentSnapshot = { exists: false };
      const mockDocRefNotFound = {
        get: jest.fn().mockResolvedValueOnce(nonExistentSnapshot),
      };
      mockCollection.doc.mockReturnValueOnce(mockDocRefNotFound);

      await expect(taskService.findById('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all tasks', async () => {
      mockCollection.get.mockResolvedValueOnce(mockQuerySnapshot);

      const result = await taskService.findAll();

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('title');
    });

    it('should return empty array when no tasks exist', async () => {
      const emptySnapshot = {
        docs: [],
        empty: true,
      };
      mockCollection.get.mockResolvedValueOnce(emptySnapshot);

      const result = await taskService.findAll();

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(0);
    });

    it('should map multiple documents correctly', async () => {
      const multipleDocsSnapshot = {
        docs: [
          {
            id: 'task-1',
            data: () => ({
              title: 'Task 1',
              status: TaskStatus.NotStarted,
              dueDate: '2026-05-20T00:00:00Z',
            }),
          },
          {
            id: 'task-2',
            data: () => ({
              title: 'Task 2',
              status: TaskStatus.InProgress,
              dueDate: '2026-05-21T00:00:00Z',
            }),
          },
        ],
      };
      mockCollection.get.mockResolvedValueOnce(multipleDocsSnapshot);

      const result = await taskService.findAll();

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('task-1');
      expect(result[1].id).toBe('task-2');
    });
  });

  describe('updateStatus', () => {
    it('should update task status', async () => {
      const updatedSnapshot = {
        id: 'task-123',
        data: () => ({
          title: 'Test Task',
          description: 'Test Description',
          status: TaskStatus.InProgress,
          dueDate: '2026-05-20T00:00:00Z',
          createdAt: '2026-05-14T00:00:00Z',
          updatedAt: '2026-05-14T01:00:00Z',
        }),
      };

      mockDocRef.get.mockResolvedValueOnce(mockDocSnapshot);
      mockDocRef.get.mockResolvedValueOnce(updatedSnapshot);
      mockCollection.doc.mockReturnValue(mockDocRef);

      const result = await taskService.updateStatus(
        'task-123',
        TaskStatus.InProgress,
      );

      expect(result.status).toBe(TaskStatus.InProgress);
      expect(mockDocRef.update).toHaveBeenCalledWith(
        expect.objectContaining({
          status: TaskStatus.InProgress,
        }),
      );
    });

    it('should update the updatedAt timestamp', async () => {
      const mockDocRefForUpdate = {
        get: jest.fn()
          .mockResolvedValueOnce(mockDocSnapshot)
          .mockResolvedValueOnce({
            id: 'task-123',
            data: () => ({
              ...mockDocSnapshot.data(),
              status: TaskStatus.Complete,
              updatedAt: new Date().toISOString(),
            }),
          }),
        update: jest.fn().mockResolvedValue({}),
      };

      mockCollection.doc.mockReturnValue(mockDocRefForUpdate);

      const result = await taskService.updateStatus(
        'task-123',
        TaskStatus.Complete,
      );

      expect(result.updatedAt).toBeDefined();
      expect(typeof result.updatedAt).toBe('string');
      // Verify that updatedAt is a valid ISO string
      expect(new Date(result.updatedAt).getTime()).toBeGreaterThan(0);
    });

    it('should throw NotFoundException when task does not exist', async () => {
      const nonExistentSnapshot = { exists: false };
      const mockDocRefNotFound = {
        get: jest.fn().mockResolvedValueOnce(nonExistentSnapshot),
      };
      mockCollection.doc.mockReturnValue(mockDocRefNotFound);

      await expect(
        taskService.updateStatus('non-existent', TaskStatus.InProgress),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a task', async () => {
      mockDocRef.get.mockResolvedValueOnce(mockDocSnapshot);
      mockCollection.doc.mockReturnValue(mockDocRef);

      await taskService.delete('task-123');

      expect(mockDocRef.delete).toHaveBeenCalled();
    });

    it('should throw NotFoundException when task does not exist', async () => {
      const nonExistentSnapshot = { exists: false };
      mockDocRef.get.mockResolvedValueOnce(nonExistentSnapshot);
      mockCollection.doc.mockReturnValue(mockDocRef);

      await expect(taskService.delete('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
