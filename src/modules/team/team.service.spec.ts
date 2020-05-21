import { Test, TestingModule } from '@nestjs/testing';
import { mockConnectionProvider } from 'common/mocks';
import { ParticipantRepository } from 'modules/participant/participant.repository';
import { StackoverflowRepository } from 'modules/stackoverflow/stackoverflow.repository';
import { StackoverflowService } from 'modules/stackoverflow/stackoverflow.service';
import { TeamRepository } from './team.repository';
import { TeamService } from './team.service';

describe('TeamService', () => {
  let service: TeamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        mockConnectionProvider,
        ParticipantRepository,
        StackoverflowRepository,
        StackoverflowService,
        TeamRepository,
        TeamService,
      ],
    }).compile();

    service = module.get<TeamService>(TeamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
