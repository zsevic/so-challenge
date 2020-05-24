import { Test, TestingModule } from '@nestjs/testing';
import { mockConnectionProvider } from 'common/mocks';
import { Participant } from 'modules/participant/participant.payload';
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
    const teamId = '913e59c4-a249-4cd3-9c08-6cd75386c773';
    const participantIds = [
      '6c220bf1-d78e-42bd-a1f6-e7aa704a7072',
      'f4872df9-293d-4342-9bea-dff5815e6eed',
      'ff233562-fc3c-45e2-9f90-688143de8c58',
    ];
    const score = 0;
    const createdTeam = {
      ...team,
      members: team.members.map(
        (member: Participant, index: number): Participant => ({
          ...member,
          id: participantIds[index],
          score,
          team_id: teamId,
        }),
      ),
      score,
    };
    jest
      .spyOn(stackoverflowService, 'validateIfRegistrationEnded')
      .mockReturnValue(false);
    jest.spyOn(stackoverflowService, 'validateTeam').mockResolvedValue();
    jest.spyOn(teamService, 'createTeam').mockResolvedValue(createdTeam);

    expect(await controller.registerTeam(team)).toBe(createdTeam);
  });
});
