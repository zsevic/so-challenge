import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, EntityManager } from 'typeorm';
import { MemberRepository } from 'modules/member/member.repository';
import { populateLeaderboard } from 'modules/team/services/stackoverflow.service';
import { CreateTeamDto } from './dto';
import { Team } from './team.payload';
import { TeamRepository } from './team.repository';

@Injectable()
export class TeamService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly memberRepository: MemberRepository,
    private readonly teamRepository: TeamRepository,
  ) {}

  async createTeam(teamDto: CreateTeamDto): Promise<Team> {
    return this.connection.transaction(async (manager: EntityManager) => {
      const team = await this.teamRepository.createTeam(teamDto.name, manager);

      const memberList = teamDto.members.map(member => ({
        ...member,
        team_id: team.id,
      }));

      const members = await this.memberRepository.bulkCreateMembers(
        memberList,
        manager,
      );

      return {
        ...team,
        members,
      };
    });
  }

  async getLeaderboard(): Promise<Team[]> {
    const teamList = await this.teamRepository.getTeamList();

    await populateLeaderboard(teamList);

    return teamList.sort(
      (teamA: Team, teamB: Team): number => teamB.score - teamA.score,
    );
  }

  async getTeamList(): Promise<Team[]> {
    return this.teamRepository.getTeamList();
  }
}
