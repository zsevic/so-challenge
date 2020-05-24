import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, EntityManager } from 'typeorm';
import { LEADERBOARD_END_TIMESTAMP } from 'modules/challenge/challenge.constants';
import { ChallengeService } from 'modules/challenge/challenge.service';
import { ParticipantEntity } from 'modules/participant/participant.entity';
import { TeamEntity } from 'modules/team/team.entity';
import { TeamService } from 'modules/team/team.service';
import { CRON_JOB_NAME, INTERVAL } from './tasks.constants';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly challengeService: ChallengeService,
    private readonly teamService: TeamService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  validateIfCronJobFinished = (): boolean =>
    LEADERBOARD_END_TIMESTAMP <= new Date().getTime();

  @Cron(CronExpression.EVERY_2ND_HOUR, {
    name: CRON_JOB_NAME,
  })
  async handleCron() {
    if (process.env.NODE_APP_INSTANCE && process.env.NODE_APP_INSTANCE !== '0')
      return;

    const isCronJobFinished = this.validateIfCronJobFinished();
    if (isCronJobFinished) {
      const job = this.schedulerRegistry.getCronJob(CRON_JOB_NAME);
      job.stop();

      this.logger.log(`Cron job "${CRON_JOB_NAME}" is stopped`);
      return;
    }

    this.logger.debug(`Called every ${INTERVAL} minute(s)`);
    const {
      participants,
      participantList,
      teams,
      teamList,
    } = await this.teamService.getInitData();

    try {
      const answerList = await this.challengeService.getAnswerList(
        participants,
      );
      const answeredQuestions = this.challengeService.getAnsweredQuestions(
        participants,
        answerList,
      );
      const questionList = await this.challengeService.getQuestionList(
        answeredQuestions,
      );

      questionList.forEach(question => {
        const participantIds = Object.keys(participants).map(
          (id: string): number => +id,
        );
        const isValidQuestion = this.challengeService.validateQuestion(
          question,
          participantIds,
        );

        if (isValidQuestion) {
          const answeredQuestion = answeredQuestions[question.question_id];
          this.challengeService.incrementScore(
            answeredQuestion,
            participants,
            teams,
            question,
          );
        }
      });

      await this.connection.transaction(
        async (manager: EntityManager): Promise<void> => {
          await manager
            .save(TeamEntity, teamList)
            .then(() => this.logger.debug('Teams saved'));
          await manager
            .save(ParticipantEntity, participantList)
            .then(() => this.logger.debug('Participants saved'));
          this.logger.log('Leaderboard is updated');
        },
      );
    } catch (err) {
      this.logger.error(err);
    }
  }
}
