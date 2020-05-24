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
  let stackoverflowService: StackoverflowService;
  let teamService: TeamService;

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
    stackoverflowService = module.get<StackoverflowService>(
      StackoverflowService,
    );
    teamService = module.get<TeamService>(TeamService);
  });

  it('should create a team', async () => {
    const team = {
      name: 'team1',
      members: [
        {
          name: 'member1',
          stackoverflow_id: 1234,
        },
        {
          name: 'member2',
          stackoverflow_id: 2345,
        },
        {
          name: 'member3',
          stackoverflow_id: 3456,
        },
      ],
    };
    const memberIds = ['id1', 'id2', 'id3'];
    const createdTeam = {
      ...team,
      members: team.members.map((member, index) => ({
        ...member,
        id: memberIds[index],
      })),
    };
    jest
      .spyOn(stackoverflowService, 'validateIfRegistrationEnded')
      .mockReturnValue(false);
    jest.spyOn(stackoverflowService, 'validateTeam').mockResolvedValue();
    jest.spyOn(teamService, 'createTeam').mockResolvedValue(createdTeam);

    expect(await controller.registerTeam(team)).toBe(createdTeam);
  });
});
