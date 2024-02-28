import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TodosService } from './todos.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from '@prisma/client';

const mockTodos: Todo[] = [
  {
    id: 1,
    title: 'Todo 1',
    description: 'Description 1',
    isDone: false,
    finished: null,
    status: true,
  },
  {
    id: 2,
    title: 'Todo 2',
    description: 'Description 2',
    isDone: true,
    finished: new Date(),
    status: true,
  },
];

describe('TodosService', () => {
  let service: TodosService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: PrismaService,
          useValue: {
            todo: {
              findMany: jest.fn().mockReturnValue(mockTodos),
              findUnique: jest.fn().mockReturnValue(mockTodos[0]),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of todos', async () => {
      jest.spyOn(prisma.todo, 'findMany').mockResolvedValueOnce(mockTodos);

      const todos = await service.findAll();

      expect(todos).toEqual(mockTodos);
    });
  });

  describe('findOne', () => {
    it('should return a todo when given a valid id', async () => {
      jest.spyOn(prisma.todo, 'findUnique').mockResolvedValueOnce(mockTodos[0]);

      const todo = await service.findOne(1);

      expect(todo).toEqual(mockTodos[0]);
    });

    it('should throw NotFoundException when given an invalid id', async () => {
      jest.spyOn(prisma.todo, 'findUnique').mockResolvedValueOnce(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new todo', async () => {
      const createTodoDto: CreateTodoDto = { title: 'New Todo' };

      await service.create(createTodoDto);

      expect(prisma.todo.create).toHaveBeenCalledWith({
        data: createTodoDto,
      });
    });

    it('should create a new todo with description', async () => {
      const createTodoDto: CreateTodoDto = {
        title: 'New Todo',
        description: 'New Description',
      };

      await service.create(createTodoDto);

      expect(prisma.todo.create).toHaveBeenCalledWith({
        data: createTodoDto,
      });
    });
  });

  describe('update', () => {
    it('should update only title and description', async () => {
      const updateTodoDto: UpdateTodoDto = {
        title: 'Updated Title',
        description: 'Updated Description',
      };

      await service.update(1, updateTodoDto);

      expect(prisma.todo.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          title: 'Updated Title',
          description: 'Updated Description',
          finished: null,
        },
      });
    });

    it('should update isDone to true', async () => {
      const updateTodoDto: UpdateTodoDto = { isDone: true };

      await service.update(1, updateTodoDto);

      expect(prisma.todo.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { isDone: true, finished: expect.any(Date) },
      });
    });

    it('should update isDone to false', async () => {
      const updateTodoDto: UpdateTodoDto = { isDone: false };

      await service.update(1, updateTodoDto);

      expect(prisma.todo.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { isDone: false, finished: null },
      });
    });
  });

  describe('remove', () => {
    it('should soft delete a todo', async () => {
      await service.remove(1);

      expect(prisma.todo.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { status: false },
      });
    });
  });
});
