import { Test, TestingModule } from '@nestjs/testing';
import { ParticipantRepository } from 'modules/participant/participant.repository';
import { TeamRepository } from 'modules/team/team.repository';
import { ChallengeRepository } from './challenge.repository';
import { ChallengeService } from './challenge.service';

describe('ChallengeService', () => {
  let service: ChallengeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChallengeRepository,
        ChallengeService,
        ParticipantRepository,
        TeamRepository,
      ],
    }).compile();

    service = module.get<ChallengeService>(ChallengeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
