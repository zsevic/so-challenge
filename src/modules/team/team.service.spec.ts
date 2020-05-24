import { Test, TestingModule } from '@nestjs/testing';
import { mockConnectionProvider } from 'common/mocks';
import { ParticipantRepository } from 'modules/participant/participant.repository';
import { StackoverflowRepository } from 'modules/stackoverflow/stackoverflow.repository';
import { StackoverflowService } from 'modules/stackoverflow/stackoverflow.service';
import { TeamRepository } from './team.repository';
import { TeamService } from './team.service';

describe('TeamService', () => {
  let service: TeamService;
  let repository: TeamRepository;

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
    repository = module.get<TeamRepository>(TeamRepository);
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
    jest.spyOn(repository, 'getTeamList').mockResolvedValue(teamList);

    expect(await service.getTeamList()).toStrictEqual(teamList);
  });
});
