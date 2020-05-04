import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, EntityManager } from 'typeorm';
import { populateLeaderboard } from 'common/services/stackoverflow.service';
import { MemberEntity } from 'modules/member/member.entity';
import { Member } from 'modules/member/member.payload';
import { TeamEntity } from 'modules/team/team.entity';
import { Team } from 'modules/team/team.payload';
import { TeamRepository } from 'modules/team/team.repository';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly teamRepository: TeamRepository,
  ) {}

  @Interval(600000)
  async handleCron() {
    this.logger.debug('Called every 5 minutes');
    const teamList = await this.teamRepository.getTeamList();
    const memberList = teamList
      .map((team: Team): Member[] => team.members)
      .reduce((acc, current) => acc.concat(current), []);

    await populateLeaderboard(teamList, memberList);

    await this.connection.transaction(
      async (manager: EntityManager): Promise<void> => {
        await manager.save(TeamEntity, teamList);
        await manager.save(MemberEntity, memberList);
        this.logger.log('Leaderboard is updated');
      },
    );
  }
}
