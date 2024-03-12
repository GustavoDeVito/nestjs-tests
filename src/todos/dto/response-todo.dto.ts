import { Expose } from 'class-transformer';

export class ResponseTodoDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  description?: string;

  @Expose()
  isDone: boolean;

  @Expose()
  finished?: Date;
}
