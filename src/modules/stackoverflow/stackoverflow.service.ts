import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import {
  USERS_BATCH_SIZE,
  QUESTIONS_BATCH_SIZE,
  TAGS,
} from 'common/config/constants';
import { getAnswersUrl, splitBy, getQuestionsUrl } from 'common/utils';
import {
  validateQuestionOwner,
  validateQuestionCreationDate,
} from 'common/utils/validations';
import { Participant } from 'modules/participant/participant.payload';
import { StackoverflowRepository } from 'modules/stackoverflow/stackoverflow.repository';
import { Team } from 'modules/team/team.payload';

@Injectable()
export class StackoverflowService {
  private readonly logger = new Logger(StackoverflowService.name);
  constructor(
    private readonly stackoverflowRepository: StackoverflowRepository,
  ) {}

  async getAnswerList(participantList: Participant[]): Promise<any> {
    const participantsStackoverflowIds = participantList.map(
      (participant: Participant): number => participant.stackoverflow_id,
    );
    const participantsStackoverflowIdsList = splitBy(
      USERS_BATCH_SIZE,
      participantsStackoverflowIds,
    );
    const answers = participantsStackoverflowIdsList
      .map((participantsStackoverflowIds: number[]): string =>
        participantsStackoverflowIds.join(';'),
      )
      .map((usersIds: string): string => getAnswersUrl(usersIds))
      .map((answersUrl: string) => axios.get(answersUrl));

    return this.stackoverflowRepository.getData(answers);
  }

  async validateAnsweredQuestions(
    answeredQuestions: Record<string, any>,
    participants: Record<number, Participant>,
    teams: Record<number, Team>,
  ): Promise<void> {
    const answeredQuestionsIds = Object.keys(answeredQuestions).map(
      (id: string): number => +id,
    );
    if (answeredQuestionsIds.length === 0) {
      this.logger.log('There are no answered questions');
      return;
    }

    const questionsIdsList = splitBy(
      QUESTIONS_BATCH_SIZE,
      answeredQuestionsIds,
    );
    const questions = questionsIdsList
      .map((questionsIds: number[]): string => questionsIds.join(';'))
      .map((questionsIds: string): string => getQuestionsUrl(questionsIds))
      .map((questionsUrl: string) => axios.get(questionsUrl));

    const questionList = await this.stackoverflowRepository.getData(questions);
    questionList.forEach(question => {
      const participantIds = Object.keys(participants).map(
        (participant: string): number => +participant,
      );
      const questionOwnerId = question.owner.user_id;
      const answeredQuestion = answeredQuestions[question.question_id];
      const containsValidTag =
        question.tags.some(tag => TAGS.includes(tag)) || TAGS.length === 0;
      const isValidQuestionOwner = validateQuestionOwner(
        questionOwnerId,
        participantIds,
      );
      const isValidQuestionCreationDate =
        question.creation_date &&
        validateQuestionCreationDate(question.creation_date);
      if (
        containsValidTag &&
        isValidQuestionCreationDate &&
        isValidQuestionOwner
      ) {
        const participantIds = Object.keys(answeredQuestion);
        participantIds.forEach(participantId => {
          const participant = participants[participantId];
          const answer = answeredQuestion[participantId];

          participant.score += answer.score;
          participant.link = answer.owner.link;
          teams[participant.team_id].score += answer.score;
          this.logger.debug(`${question.title}, score: ${answer.score}`);
        });
      }
    });
  }
}
