import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChallengeModule } from 'modules/challenge/challenge.module';
import { TeamRepository } from 'modules/team/team.repository';
import { TasksService } from './tasks.service';

@Module({
  imports: [TypeOrmModule.forFeature([TeamRepository]), ChallengeModule],
  providers: [TasksService],
})
export class TasksModule {}
