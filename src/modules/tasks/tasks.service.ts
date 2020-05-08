import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, EntityManager } from 'typeorm';
import {
  getAnswerList,
  getAnsweredQuestions,
  validateAnsweredQuestions,
} from 'common/services/stackoverflow.service';
import { initialize } from 'common/utils';
import { MemberEntity } from 'modules/member/member.entity';
import { Member } from 'modules/member/member.payload';
import { TeamEntity } from 'modules/team/team.entity';
import { Team } from 'modules/team/team.payload';
import { TeamRepository } from 'modules/team/team.repository';
import { INTERVAL } from './tasks.constants';

const INTERVAL_VALUE = INTERVAL * 60 * 1000;

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly teamRepository: TeamRepository,
  ) {}

  @Interval(INTERVAL_VALUE)
  async handleCron() {
    this.logger.debug(`Called every ${INTERVAL} minute(s)`);
    const teamList = await this.teamRepository.getTeamList();
    const memberList = teamList
      .map((team: Team): Member[] => team.members)
      .reduce((acc, current) => acc.concat(current), []);

    const { members, teams } = initialize(memberList, teamList);

    try {
      const answerList = await getAnswerList(memberList);
      const questionList = getAnsweredQuestions(members, answerList);
      await validateAnsweredQuestions(questionList, members, teams);

      await this.connection.transaction(
        async (manager: EntityManager): Promise<void> => {
          await manager
            .save(TeamEntity, teamList)
            .then(() => this.logger.debug('team saved'));
          await manager
            .save(MemberEntity, memberList)
            .then(() => this.logger.debug('members saved'));
          this.logger.log('Leaderboard is updated');
        },
      );
    } catch (err) {
      this.logger.error(err);
    }
  }
}
