import { Test, TestingModule } from '@nestjs/testing';
import { mockConnectionProvider } from 'common/mocks';
import { ParticipantRepository } from 'modules/participant/participant.repository';
import { StackoverflowRepository } from 'modules/stackoverflow/stackoverflow.repository';
import { StackoverflowService } from 'modules/stackoverflow/stackoverflow.service';
import { TeamController } from './team.controller';
import { TeamRepository } from './team.repository';
import { TeamService } from './team.service';

describe('Team Controller', () => {
  let controller: TeamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamController],
      providers: [
        mockConnectionProvider,
        ParticipantRepository,
        StackoverflowRepository,
        StackoverflowService,
        TeamRepository,
        TeamService,
      ],
    }).compile();

    controller = module.get<TeamController>(TeamController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
