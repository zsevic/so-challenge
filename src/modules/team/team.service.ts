import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, EntityManager } from 'typeorm';
import { Participant } from 'modules/participant/participant.payload';
import { ParticipantRepository } from 'modules/participant/participant.repository';
import { StackoverflowService } from 'modules/stackoverflow/stackoverflow.service';
import { CreateTeamDto } from './dto';
import { Team } from './team.payload';
import { TeamRepository } from './team.repository';

@Injectable()
export class TeamService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly participantRepository: ParticipantRepository,
    private readonly teamRepository: TeamRepository,
    private readonly stackoverflowService: StackoverflowService,
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

  async getTeamList(): Promise<Team[]> {
    return this.teamRepository.getTeamList();
  }
}
