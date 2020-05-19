import { BadRequestException } from '@nestjs/common';
import {
  ANSWER_START_YEAR,
  ANSWER_START_MONTH,
  ANSWER_START_DAY,
  ANSWER_START_HOURS,
  ANSWER_START_MINUTES,
  ANSWER_END_YEAR,
  ANSWER_END_MONTH,
  ANSWER_END_DAY,
  ANSWER_END_HOURS,
  ANSWER_END_MINUTES,
  QUESTION_START_YEAR,
  QUESTION_START_MONTH,
  QUESTION_START_DAY,
  QUESTION_START_HOURS,
  QUESTION_START_MINUTES,
  QUESTION_END_YEAR,
  QUESTION_END_MONTH,
  QUESTION_END_DAY,
  QUESTION_END_HOURS,
  QUESTION_END_MINUTES,
} from 'common/config/constants';
import { Member } from 'modules/member/member.payload';

export const validateAnswerCreationDate = (creationDate: number): boolean => {
  const answerCreationDate = new Date(creationDate * 1000).getTime();
  return (
    new Date(
      ANSWER_START_YEAR,
      ANSWER_START_MONTH,
      ANSWER_START_DAY,
      ANSWER_START_HOURS,
      ANSWER_START_MINUTES,
    ).getTime() <= answerCreationDate &&
    answerCreationDate <=
      new Date(
        ANSWER_END_YEAR,
        ANSWER_END_MONTH,
        ANSWER_END_DAY,
        ANSWER_END_HOURS,
        ANSWER_END_MINUTES,
      ).getTime()
  );
};

export const validateEditedAnswer = (lastEditDate: number): boolean => {
  const answerLastEditDate = new Date(lastEditDate * 1000).getTime();
  return (
    answerLastEditDate <=
    new Date(
      ANSWER_END_YEAR,
      ANSWER_END_MONTH,
      ANSWER_END_DAY,
      ANSWER_END_HOURS,
      ANSWER_END_MINUTES,
    ).getTime()
  );
};

export const validateMemberName = (
  memberName: string,
  answerOwnerName: string,
): boolean => memberName.localeCompare(answerOwnerName) === 0;

export const validateQuestionCreationDate = (creationDate: number): boolean => {
  const questionCreationDate = new Date(creationDate * 1000).getTime();
  return (
    new Date(
      QUESTION_START_YEAR,
      QUESTION_START_MONTH,
      QUESTION_START_DAY,
      QUESTION_START_HOURS,
      QUESTION_START_MINUTES,
    ).getTime() <= questionCreationDate &&
    questionCreationDate <=
      new Date(
        QUESTION_END_YEAR,
        QUESTION_END_MONTH,
        QUESTION_END_DAY,
        QUESTION_END_HOURS,
        QUESTION_END_MINUTES,
      ).getTime()
  );
};

export const validateQuestionOwner = (
  questionOwnerId: number,
  participantIds: number[],
): boolean => !participantIds.includes(questionOwnerId);

export function validateTeamMembers(users: any, teamMembers: Member[]): void {
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
