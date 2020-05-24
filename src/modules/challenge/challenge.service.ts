import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import {
  ANSWERS_START_YEAR,
  ANSWERS_START_MONTH,
  ANSWERS_START_DAY,
  ANSWER_END_YEAR,
  ANSWER_END_MONTH,
  ANSWER_END_DAY,
  ANSWERS_END_TIMESTAMP,
  ANSWERS_START_TIMESTAMP,
  QUESTIONS_BATCH_SIZE,
  QUESTIONS_END_TIMESTAMP,
  QUESTIONS_START_TIMESTAMP,
  QUESTIONS_PAGE_SIZE,
  QUESTIONS_START_YEAR,
  QUESTIONS_START_MONTH,
  QUESTIONS_START_DAY,
  QUESTIONS_END_YEAR,
  QUESTIONS_END_MONTH,
  QUESTIONS_END_DAY,
  QUESTION_TAGS,
  USERS_BATCH_SIZE,
  USERS_PAGE_SIZE,
} from 'modules/challenge/challenge.constants';
import { getQueryParameterDateFormat, splitBy } from 'common/utils';
import { REGISTRATION_END_TIMESTAMP } from 'modules/challenge/challenge.constants';
import { ChallengeRepository } from 'modules/challenge/challenge.repository';
import { Participant } from 'modules/participant/participant.payload';
import { Team } from 'modules/team/team.payload';

@Injectable()
export class ChallengeService {
  private readonly logger = new Logger(ChallengeService.name);
  constructor(private readonly challengeRepository: ChallengeRepository) {}

  getAnsweredQuestions = (
    participants: Record<string, Participant>,
    answers: any,
  ): Record<string, any> => {
    const answeredQuestions = {};

    answers.forEach((answer: any): void => {
      const { name: participantName } = participants[answer.owner.user_id];
      const isValidAnswer = this.validateAnswer(answer, participantName);

      if (isValidAnswer) {
        const questionId = +answer.question_id;
        if (!answeredQuestions[answer.question_id]) {
          answeredQuestions[questionId] = {
            [answer.owner.user_id]: answer,
          };
        } else {
          answeredQuestions[questionId][answer.owner.user_id] = answer;
        }
      }
    });
    return answeredQuestions;
  };

  getAnswerList = async (
    participants: Record<string, Participant>,
  ): Promise<any> => {
    const participantIds = Object.keys(participants).map(
      (id: string): number => +id,
    );
    const participantIdsList = splitBy(USERS_BATCH_SIZE, participantIds);
    const answers = participantIdsList
      .map((ids: number[]): string => ids.join(';'))
      .map((usersIds: string): string => this.getAnswersUrl(usersIds))
      .map((answersUrl: string) => axios.get(answersUrl));

    return this.challengeRepository.getData(answers);
  };

  getAnswersUrl = (
    usersIds: string,
    pagesize = USERS_PAGE_SIZE,
    page = 1,
  ): string => {
    const ANSWERS_FROM_DATE = getQueryParameterDateFormat(
      ANSWERS_START_YEAR,
      ANSWERS_START_MONTH,
      ANSWERS_START_DAY,
    );
    const ANSWERS_TO_DATE = getQueryParameterDateFormat(
      ANSWER_END_YEAR,
      ANSWER_END_MONTH,
      ANSWER_END_DAY,
    );

    return `https://api.stackexchange.com/2.2/users/${usersIds}/answers?site=stackoverflow&fromdate=${ANSWERS_FROM_DATE}&todate=${ANSWERS_TO_DATE}&page=${page}&pagesize=${pagesize}`;
  };

  getParticipantIds = (participantList: Participant[]): string =>
    participantList
      .map((participant: Participant): number => participant.stackoverflow_id)
      .join(';');

  getQuestionList = async (
    answeredQuestions: Record<string, any>,
  ): Promise<any> => {
    const answeredQuestionIds = Object.keys(answeredQuestions).map(
      (id: string): number => +id,
    );
    if (answeredQuestionIds.length === 0) {
      this.logger.log('There are no answered questions');
      return;
    }

    const questionIdsList = splitBy(QUESTIONS_BATCH_SIZE, answeredQuestionIds);

    const questions = questionIdsList
      .map((questionsIds: number[]): string => questionsIds.join(';'))
      .map((questionsIds: string): string => this.getQuestionsUrl(questionsIds))
      .map((questionsUrl: string) => axios.get(questionsUrl));

    return this.challengeRepository.getData(questions);
  };

  getQuestionsUrl = (
    questionsIds: string,
    pagesize = QUESTIONS_PAGE_SIZE,
    page = 1,
  ): string => {
    const QUESTIONS_FROM_DATE = getQueryParameterDateFormat(
      QUESTIONS_START_YEAR,
      QUESTIONS_START_MONTH,
      QUESTIONS_START_DAY,
    );
    const QUESTIONS_TO_DATE = getQueryParameterDateFormat(
      QUESTIONS_END_YEAR,
      QUESTIONS_END_MONTH,
      QUESTIONS_END_DAY,
    );

    return `https://api.stackexchange.com/2.2/questions/${questionsIds}?site=stackoverflow&fromdate=${QUESTIONS_FROM_DATE}&todate=${QUESTIONS_TO_DATE}&page=${page}&pagesize=${pagesize}`;
  };

  getUsersUrl = (usersIds: string): string =>
    `https://api.stackexchange.com/2.2/users/${usersIds}?site=stackoverflow`;

  getUsers = async (team: Team): Promise<void> => {
    const ids = this.getParticipantIds(team.members);
    const usersUrl = this.getUsersUrl(ids);
    return this.challengeRepository.getUsers(usersUrl);
  };

  incrementScore = (answeredQuestion, participants, teams, question): void => {
    const participantIds = Object.keys(answeredQuestion);
    participantIds.forEach(participantId => {
      const participant = participants[participantId];
      const answer = answeredQuestion[participantId];

      participant.score += answer.score;
      participant.link = answer.owner.link;
      teams[participant.team_id].score += answer.score;
      this.logger.debug(`${question.title}, score: ${answer.score}`);
    });
  };

  validateAnswerCreationDate = (creationDate: number): boolean => {
    const answerCreationDate = new Date(creationDate * 1000).getTime();
    return (
      ANSWERS_START_TIMESTAMP <= answerCreationDate &&
      answerCreationDate <= ANSWERS_END_TIMESTAMP
    );
  };

  validateAnswer = (answer: any, participantName: string): boolean => {
    const isValidParticipant = this.validateParticipantName(
      participantName,
      answer.owner.display_name,
    );
    const isValidAnswerCreationDate =
      answer.creation_date &&
      this.validateAnswerCreationDate(answer.creation_date);
    const isValidAnswerLastEditDate = !answer.last_edit_date
      ? true
      : this.validateEditedAnswer(answer.last_edit_date);
    return (
      isValidParticipant &&
      isValidAnswerCreationDate &&
      isValidAnswerLastEditDate
    );
  };

  validateEditedAnswer = (lastEditDate: number): boolean => {
    const answerLastEditDate = new Date(lastEditDate * 1000).getTime();
    return answerLastEditDate <= ANSWERS_END_TIMESTAMP;
  };

  validateIfRegistrationEnded = (): boolean =>
    REGISTRATION_END_TIMESTAMP <= new Date().getTime();

  validateParticipantName = (
    participantName: string,
    answerOwnerName: string,
  ): boolean => participantName.localeCompare(answerOwnerName) === 0;

  validateQuestion = (question: any, participantIds: number[]): boolean => {
    const containsValidTag = this.validateQuestionTags(question.tags);

    const isValidQuestionOwner = this.validateQuestionOwner(
      question.owner.user_id,
      participantIds,
    );
    const isValidQuestionCreationDate =
      question.creation_date &&
      this.validateQuestionCreationDate(question.creation_date);
    return (
      containsValidTag && isValidQuestionCreationDate && isValidQuestionOwner
    );
  };

  validateQuestionCreationDate = (creationDate: number): boolean => {
    const questionCreationDate = new Date(creationDate * 1000).getTime();
    return (
      QUESTIONS_START_TIMESTAMP <= questionCreationDate &&
      questionCreationDate <= QUESTIONS_END_TIMESTAMP
    );
  };

  validateQuestionOwner = (
    questionOwnerId: number,
    participantIds: number[],
  ): boolean => !participantIds.includes(questionOwnerId);

  validateQuestionTags = (tags: string[]): boolean =>
    tags.some((tag: string): boolean => QUESTION_TAGS.includes(tag)) ||
    QUESTION_TAGS.length === 0;

  async validateTeam(team: Team): Promise<void> {
    const teamMembers = await this.getUsers(team);
    await this.validateTeamMembers(teamMembers, team.members);
  }

  validateTeamMembers = (users: any, teamMembers: Participant[]): void => {
    if (users.length !== teamMembers.length) {
      throw new BadRequestException('Team members are not valid, length error');
    }
    const members = {};
    teamMembers.forEach((member: Participant): void => {
      const memberName = member.name.trim();
      if (members[memberName]) {
        throw new BadRequestException(
          `Team members are not valid, duplicate name ${member.name}`,
        );
      }
      members[memberName] = member.stackoverflow_id;
    });

    users.forEach((user: any): void => {
      if (
        !members[user.display_name] ||
        members[user.display_name] !== user.user_id
      ) {
        throw new BadRequestException(
          `Team member with Stackoverflow ID: ${user.user_id} is not valid`,
        );
      }
    });
  };
}
