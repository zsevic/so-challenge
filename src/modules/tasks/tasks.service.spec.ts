import { SchedulerRegistry } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import { ChallengeRepository } from 'modules/challenge/challenge.repository';
import { ChallengeService } from 'modules/challenge/challenge.service';
import { ParticipantRepository } from 'modules/participant/participant.repository';
import { TeamRepository } from 'modules/team/team.repository';
import { TeamService } from 'modules/team/team.service';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChallengeRepository,
        ChallengeService,
        ParticipantRepository,
        SchedulerRegistry,
        TasksService,
        TeamRepository,
        TeamService,
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
