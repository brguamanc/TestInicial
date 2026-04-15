import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { Task } from './tasks/entities/task.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password', // To be adjusted if needed
      database: 'test_db', // Will create this later or adjust in README
      entities: [User, Task],
      synchronize: true, // true here since this is a quick test, allows auto-migration
    }),
    UsersModule,
    TasksModule,
    AuthModule,
  ],
})
export class AppModule {}
