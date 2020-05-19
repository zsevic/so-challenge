import { parse } from 'url';
import { BadRequestException, Logger } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import {
  ANSWERS_BATCH_SIZE,
  QUESTIONS_BATCH_SIZE,
  TAGS,
} from 'common/config/constants';
import {
  getAnswersUrl,
  getQuestionsUrl,
  getUsernames,
  getUsersUrl,
  splitBy,
} from 'common/utils';
import {
  validateAnswerCreationDate,
  validateEditedAnswer,
  validateMemberName,
  validateQuestionCreationDate,
  validateQuestionOwner,
  validateTeamMembers,
} from 'common/utils/validations';
import { Member } from 'modules/member/member.payload';
import { Team } from 'modules/team/team.payload';

async function getData(
  apiCalls: Promise<AxiosResponse<any>>[],
  data = [],
): Promise<any> {
  const logger = new Logger(getData.name);
  const newApiCalls = [];
  try {
    const responses = await Promise.all(apiCalls);
    const result = responses.map(response => {
      const { url } = response.config;
      const urlPath = url.split('?')[0];
      if (response.data.has_more) {
        const { query } = parse(url, true);
        const page = +query.page + 1 + '';
        const queryParameters = new URLSearchParams({
          ...query,
          page,
        });
        const apiUrl = urlPath + '?' + queryParameters.toString();

        newApiCalls.push(axios.get(apiUrl));
      }
      const resource = urlPath.split('/').slice(-1)[0] === 'answers' ? 'answers' : 'questions';
      logger.debug(
        `get ${resource}, length: ${response.data.items.length}, has more: ${response.data.has_more},
      remaining requests: ${response.data.quota_remaining}`,
      );
      return response.data.items;
    });
    const newData = data.concat(...result);

    return newApiCalls.length > 0 ? getData(newApiCalls, newData) : newData;
  } catch (err) {
    logger.error(`get data error: ${err}`);
    throw new BadRequestException(err);
  }
}

export async function getAnswerList(memberList: Member[]): Promise<any> {
  const memberUsernames = memberList.map(
    (member: Member): number => member.username,
  );
  const usernamesList = splitBy(ANSWERS_BATCH_SIZE, memberUsernames);
  const answers = usernamesList
    .map((usernames: number[]): string => usernames.join(';'))
    .map((usernames: string): string => getAnswersUrl(usernames))
    .map((answersUrl: string) => axios.get(answersUrl));

  return getData(answers);
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
  const answeredQuestionsIds = Object.keys(answeredQuestions).map(
    (id: string): number => +id,
  );
  if (answeredQuestionsIds.length === 0) {
    logger.log('There are no answered questions');
    return;
  }

  const questionsIdsList = splitBy(QUESTIONS_BATCH_SIZE, answeredQuestionsIds);
  const questions = questionsIdsList
    .map((questionsIds: number[]): string => questionsIds.join(';'))
    .map((questionsIds: string): string => getQuestionsUrl(questionsIds))
    .map((questionsUrl: string) => axios.get(questionsUrl));

  const questionList = await getData(questions);
  questionList.forEach(question => {
    const participantIds = Object.keys(members).map(
      (participant: string): number => +participant,
    );
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

export async function validateTeam(team: Team): Promise<void> {
  const logger = new Logger(validateTeam.name);
  const memberIds = getUsernames(team.members);
  const members = await axios
    .get(getUsersUrl(memberIds))
    .then(response => {
      logger.debug(
        `get users, remaining requests: ${response.data.quota_remaining}`,
      );
      return response.data.items;
    })
    .catch(err => {
      logger.error(`get users error: ${err}`);
      throw new BadRequestException(err);
    });
  validateTeamMembers(members, team.members);
}
