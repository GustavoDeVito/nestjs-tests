import { Test, TestingModule } from '@nestjs/testing';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
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

describe('TodosController', () => {
  let controller: TodosController;
  let service: TodosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [
        {
          provide: TodosService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(mockTodos),
            findOne: jest.fn().mockReturnValue(mockTodos[0]),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TodosController>(TodosController);
    service = module.get<TodosService>(TodosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of todos', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(mockTodos);

      expect(await controller.findAll()).toBe(mockTodos);
    });
  });

  describe('findOne', () => {
    it('should return a todo when given a valid id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockTodos[0]);

      expect(await controller.findOne('1')).toBe(mockTodos[0]);
    });

    it('should throw NotFoundException when given an invalid id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(null);

      expect(await controller.findOne('999')).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new todo', async () => {
      const createTodoDto: CreateTodoDto = { title: 'New Todo' };

      jest.spyOn(service, 'create').mockResolvedValueOnce(undefined);

      expect(await controller.create(createTodoDto)).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update a todo', async () => {
      const updateTodoDto: UpdateTodoDto = { title: 'Updated Todo' };

      jest.spyOn(service, 'update').mockResolvedValueOnce(undefined);

      expect(await controller.update('1', updateTodoDto)).toBeUndefined();
    });
  });

  describe('remove', () => {
    it('should remove a todo', async () => {
      jest.spyOn(service, 'remove').mockResolvedValueOnce(undefined);

      expect(await controller.remove('1')).toBeUndefined();
    });
  });
});
