import { Test, TestingModule } from '@nestjs/testing';
import { Participant } from 'modules/participant/participant.payload';
import { ParticipantRepository } from 'modules/participant/participant.repository';
import { ChallengeRepository } from 'modules/challenge/challenge.repository';
import { ChallengeService } from 'modules/challenge/challenge.service';
import { TeamController } from './team.controller';
import { TeamRepository } from './team.repository';
import { TeamService } from './team.service';

describe('Team Controller', () => {
  let controller: TeamController;
  let challengeService: ChallengeService;
  let teamService: TeamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamController],
      providers: [
        ChallengeRepository,
        ChallengeService,
        ParticipantRepository,
        TeamRepository,
        TeamService,
      ],
    }).compile();

    controller = module.get<TeamController>(TeamController);
    challengeService = module.get<ChallengeService>(ChallengeService);
    teamService = module.get<TeamService>(TeamService);
  });

  it('should create a team', async () => {
    const team = {
      name: 'team1',
      members: [
        {
          name: 'Andy LifeBrixx',
          stackoverflow_id: 335384,
        },
        {
          name: 'user235254',
          stackoverflow_id: 235254,
        },
        {
          name: 'user235384',
          stackoverflow_id: 235384,
        },
      ],
    };
    const teamId = '370b670e-6d78-44de-be26-3d3af4d02faf';
    const participantIds = [
      'c51555dd-4e44-4259-a89a-f5f82b4b599e',
      '55be4f25-36d0-447b-8e3e-c297ac647026',
      '613dd7e4-50a1-4f27-a0a7-f572ac27e268',
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
      .spyOn(challengeService, 'validateIfRegistrationEnded')
      .mockReturnValue(false);
    jest.spyOn(challengeService, 'validateTeam').mockResolvedValue();
    jest.spyOn(teamService, 'createTeam').mockResolvedValue(createdTeam);

    expect(await controller.registerTeam(team)).toMatchObject(createdTeam);
  });

  it('should return an array of teams', async () => {
    const teamList = [
      {
        id: '370b670e-6d78-44de-be26-3d3af4d02faf',
        name: 'team1',
        score: 1,
        created_at: '2020-05-20T22:25:22.000Z',
        updated_at: '2020-05-21T00:48:11.000Z',
        members: [
          {
            id: 'c51555dd-4e44-4259-a89a-f5f82b4b599e',
            stackoverflow_id: 335384,
            team_id: '370b670e-6d78-44de-be26-3d3af4d02faf',
            link: '',
            name: 'Andy LifeBrixx',
            score: 0,
            created_at: '2020-05-20T22:25:22.000Z',
            updated_at: '2020-05-20T22:25:22.000Z',
          },
          {
            id: '55be4f25-36d0-447b-8e3e-c297ac647026',
            stackoverflow_id: 235254,
            team_id: '370b670e-6d78-44de-be26-3d3af4d02faf',
            link: '',
            name: 'user235254',
            score: 0,
            created_at: '2020-05-20T22:25:22.000Z',
            updated_at: '2020-05-20T22:25:22.000Z',
          },
          {
            id: '613dd7e4-50a1-4f27-a0a7-f572ac27e268',
            stackoverflow_id: 235384,
            team_id: '370b670e-6d78-44de-be26-3d3af4d02faf',
            link: '',
            name: 'user235384',
            score: 0,
            created_at: '2020-05-20T22:25:22.000Z',
            updated_at: '2020-05-20T22:25:22.000Z',
          },
        ],
      },
    ];
    jest.spyOn(teamService, 'getTeamList').mockResolvedValue(teamList);

    expect(await teamService.getTeamList()).toMatchObject(teamList);
  });
});
