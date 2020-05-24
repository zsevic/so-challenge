import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, EntityManager } from 'typeorm';
import { Participant } from 'modules/participant/participant.payload';
import { ParticipantRepository } from 'modules/participant/participant.repository';
import { CreateTeamDto } from './dto';
import { Team } from './team.payload';
import { TeamRepository } from './team.repository';
import { InitData } from './team.types';

@Injectable()
export class TeamService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly participantRepository: ParticipantRepository,
    private readonly teamRepository: TeamRepository,
  ) {}

  async createTeam(teamDto: CreateTeamDto): Promise<Team> {
    return this.connection.transaction(async (manager: EntityManager) => {
      const team = await this.teamRepository.createTeam(teamDto.name, manager);

      const memberList = teamDto.members.map(
        (participant: Participant): Participant => ({
          ...participant,
          team_id: team.id,
        }),
      );

      const members = await this.participantRepository.bulkCreateParticipants(
        memberList,
        manager,
      );

      return {
        ...team,
        members,
      };
    });
  }

  getInitData = async (): Promise<InitData> => {
    const teamList = await this.getTeamList();
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

  async getTeamList(): Promise<Team[]> {
    return this.teamRepository.getTeamList();
  }
}
