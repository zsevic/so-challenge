import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { Participant } from 'modules/participant/participant.payload';
import { ParticipantRepository } from 'modules/participant/participant.repository';
import { CreateTeamDto, PaginationDto, PaginatedTeamsResultDto } from './dto';
import { Team } from './team.payload';
import { TeamRepository } from './team.repository';
import { InitData } from './team.types';

@Injectable()
export class TeamService {
  constructor(
    private readonly participantRepository: ParticipantRepository,
    private readonly teamRepository: TeamRepository,
  ) {}

  @Transactional()
  async createTeam(teamDto: CreateTeamDto): Promise<Team> {
    const team = await this.teamRepository.createTeam(teamDto.name);

    const memberList = teamDto.members.map(
      (participant: Participant): Participant => ({
        ...participant,
        team_id: team.id,
      }),
    );

    const members = await this.participantRepository.bulkCreateParticipants(
      memberList,
    );

    return {
      ...team,
      members,
    };
  }

  async getAll(): Promise<Team[]> {
    return this.teamRepository.getAll();
  }

  getInitData = async (): Promise<InitData> => {
    const teamList = await this.getAll();
    const participantList = teamList
      .map((team: Team): Participant[] => team.members)
      .reduce((acc, current): Participant[] => acc.concat(current), []);

    const teams = {};
    teamList.forEach((team: Team): void => {
      const id = team.id;
      teams[id] = team;
      teams[id].score = 0;
    });

    const participants = {};
    participantList.forEach((participant: Participant): void => {
      const id = +participant.stackoverflow_id;
      participants[id] = participant;
      participants[id].score = 0;
      participants[id].stackoverflow_id = +participant.stackoverflow_id;
    });

    return { participants, participantList, teams, teamList };
  };

  async getTeamList(paginationDto: PaginationDto): Promise<PaginatedTeamsResultDto> {
    return this.teamRepository.getTeamList(paginationDto);
  }
}
