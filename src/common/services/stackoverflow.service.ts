import { Logger } from '@nestjs/common';
import axios from 'axios';
import { TAGS } from 'common/config/constants';
import { getAnswersUrl, getQuestionUrl, getUsernames } from 'common/utils';
import {
  validateAnswerCreationDate,
  validateMemberName,
  validateQuestionCreationDate,
  validateQuestionOwner,
  validateEditedAnswer,
} from 'common/utils/validations';
import { Member } from 'modules/member/member.payload';
import { Team } from 'modules/team/team.payload';

export async function getAnswerList(memberList: Member[]): Promise<any> {
  const logger = new Logger(getAnswerList.name);
  const usernames = getUsernames(memberList);
  const answersUrl = getAnswersUrl(usernames);

  return axios
    .get(answersUrl)
    .then(result => {
      logger.debug(
        `get answers, remaining requests: ${result.data.quota_remaining}`,
      );
      return result.data.items;
    })
    .catch(err => {
      logger.error('get answer', err);
      throw new Error(err);
    });
}

export function getAnsweredQuestions(
  members: Record<string, Member>,
  answers: any,
): Record<string, any> {
  const answeredQuestions = {};

  answers.forEach(answer => {
    const member = members[answer.owner.user_id];
    const isValidMember = validateMemberName(
      member.name,
      answer.owner.display_name,
    );
    const isValidAnswerCreationDate =
      answer.creation_date && validateAnswerCreationDate(answer.creation_date);
    const isValidAnswerLastEditDate = !answer.last_edit_date
      ? true
      : validateEditedAnswer(answer.last_edit_date);

    if (
      isValidMember &&
      isValidAnswerCreationDate &&
      isValidAnswerLastEditDate
    ) {
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
}

export async function validateAnsweredQuestions(
  answeredQuestions: Record<string, any>,
  members: Record<number, Member>,
  teams: Record<number, Team>,
): Promise<void> {
  const logger = new Logger(validateAnsweredQuestions.name);
  const answeredQuestionsIds = Object.keys(answeredQuestions);
  if (answeredQuestionsIds.length === 0) {
    logger.log('There are no answered questions');
    return;
  }
  const questionIds = answeredQuestionsIds.join(';');
  const participantIds = Object.keys(members).map(
    (participant: string): number => +participant,
  );
  const questions = await axios
    .get(getQuestionUrl(questionIds))
    .then(response => {
      logger.debug(
        `get questions, remaining requests: ${response.data.quota_remaining}`,
      );
      return response.data.items;
    })
    .catch(err => {
      logger.error('get question', err);
      throw new Error(err);
    });

  questions.forEach(question => {
    const questionOwnerId = question.owner.user_id;
    const answeredQuestion = answeredQuestions[question.question_id];
    const containsValidTag = question.tags.some(tag => TAGS.includes(tag));
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
      const memberIds = Object.keys(answeredQuestion);
      memberIds.forEach(memberId => {
        const member = members[memberId];
        const answer = answeredQuestion[memberId];

        member.score += answer.score;
        member.link = answer.owner.link;
        teams[member.team_id].score += answer.score;
        logger.debug(`${question.title}, score: ${answer.score}`);
      });
    }
  });
}
