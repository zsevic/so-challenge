import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StackoverflowModule } from 'modules/stackoverflow/stackoverflow.module';
import { TeamRepository } from 'modules/team/team.repository';
import { TasksService } from './tasks.service';

@Module({
  imports: [TypeOrmModule.forFeature([TeamRepository]), StackoverflowModule],
  providers: [TasksService],
})
export class TasksModule {}
