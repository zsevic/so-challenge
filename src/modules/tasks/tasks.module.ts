import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamRepository } from 'modules/team/team.repository';
import { TasksService } from './tasks.service';

@Module({
  imports: [TypeOrmModule.forFeature([TeamRepository])],
  providers: [TasksService],
})
export class TasksModule {}
