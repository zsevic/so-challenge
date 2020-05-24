import { SchedulerRegistry } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import { connectionProviderMock } from 'common/mocks';
import { ChallengeRepository } from 'modules/challenge/challenge.repository';
import { ChallengeService } from 'modules/challenge/challenge.service';
import { TeamRepository } from 'modules/team/team.repository';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChallengeRepository,
        ChallengeService,
        connectionProviderMock,
        SchedulerRegistry,
        TasksService,
        TeamRepository,
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
