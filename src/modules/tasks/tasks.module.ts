import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChallengeModule } from 'modules/challenge/challenge.module';
import { TeamModule } from 'modules/team/team.module';
import { TeamRepository } from 'modules/team/team.repository';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TeamRepository]),
    ChallengeModule,
    TeamModule,
  ],
  providers: [TasksService],
})
export class TasksModule {}
