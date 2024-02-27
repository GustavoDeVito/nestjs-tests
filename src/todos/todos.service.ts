import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.todo.findMany({
      where: {
        status: true,
      },
    });
  }

  async findOne(id: number) {
    const todo = await this.prisma.todo.findUnique({
      where: { id, status: true },
    });

    if (!todo) {
      throw new NotFoundException('Tarefa não encontrada.');
    }

    return todo;
  }

  async create(createTodoDto: CreateTodoDto) {
    await this.prisma.todo.create({ data: createTodoDto });
  }

  async update(id: number, updateTodoDto: UpdateTodoDto) {
    await this.findOne(id);

    let finished: Date | null = null;
    if (updateTodoDto?.isDone) {
      finished = new Date();
    }

    await this.prisma.todo.update({
      where: { id },
      data: { ...updateTodoDto, finished },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.todo.update({ where: { id }, data: { status: false } });
  }
}
