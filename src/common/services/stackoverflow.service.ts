import { BadRequestException, Logger } from '@nestjs/common';
import axios from 'axios';
import { BATCH_SIZE, TAGS } from 'common/config/constants';
import {
  getAnswersUrl,
  getQuestionsUrl,
  getUsernames,
  getUsersUrl,
  splitBy,
} from 'common/utils';
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
  const memberUsernames = memberList.map(
    (member: Member): number => member.username,
  );
  const usernamesList = splitBy(BATCH_SIZE, memberUsernames);
  const answers = usernamesList
    .map((usernames: number[]): string => usernames.join(';'))
    .map((usernames: string): string => getAnswersUrl(usernames))
    .map((answersUrl: string) => axios.get(answersUrl));

  return Promise.all(answers)
    .then(results =>
      results.map(result => {
        logger.debug(
          `get answers, remaining requests: ${result.data.quota_remaining}`,
        );
        return result.data.items;
      }),
    )
    .then(result => [].concat(...result))
    .catch(
      (err: Error): BadRequestException => {
        logger.error(`get answers error: ${err}`);
        throw new BadRequestException(err);
      },
    );
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
  const questionsIds = answeredQuestionsIds.join(';');
  const participantIds = Object.keys(members).map(
    (participant: string): number => +participant,
  );
  const questions = await axios
    .get(getQuestionsUrl(questionsIds))
    .then(response => {
      logger.debug(
        `get questions, remaining requests: ${response.data.quota_remaining}`,
      );
      return response.data.items;
    })
    .catch(err => {
      logger.error(`get questions error: ${err}`);
      throw new BadRequestException(err);
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

export function validateMembers(users: any, teamMembers: Member[]): void {
  if (users.length !== teamMembers.length) {
    throw new BadRequestException('Team members are not valid, length error');
  }
  const members = {};
  teamMembers.forEach((member: Member): void => {
    const memberName = member.name.trim();
    if (members[memberName]) {
      throw new BadRequestException(
        `Team members are not valid, duplicate name ${member.name}`,
      );
    }
    members[memberName] = member.username;
  });

  users.forEach((user: any): void => {
    if (
      !members[user.display_name] ||
      members[user.display_name] !== user.user_id
    ) {
      throw new BadRequestException(
        `Team member with username: ${user.user_id} is not valid`,
      );
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
  validateMembers(members, team.members);
}
