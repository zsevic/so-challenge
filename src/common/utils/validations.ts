import { BadRequestException } from '@nestjs/common';
import {
  ANSWERS_START_TIMESTAMP,
  ANSWERS_END_TIMESTAMP,
  QUESTIONS_START_TIMESTAMP,
  QUESTIONS_END_TIMESTAMP,
} from 'common/config/constants';
import { Participant } from 'modules/participant/participant.payload';

export const validateAnswerCreationDate = (creationDate: number): boolean => {
  const answerCreationDate = new Date(creationDate * 1000).getTime();
  return (
    ANSWERS_START_TIMESTAMP <= answerCreationDate &&
    answerCreationDate <= ANSWERS_END_TIMESTAMP
  );
};

export const validateEditedAnswer = (lastEditDate: number): boolean => {
  const answerLastEditDate = new Date(lastEditDate * 1000).getTime();
  return answerLastEditDate <= ANSWERS_END_TIMESTAMP;
};

export const validateParticipantName = (
  participantName: string,
  answerOwnerName: string,
): boolean => participantName.localeCompare(answerOwnerName) === 0;

export const validateQuestionCreationDate = (creationDate: number): boolean => {
  const questionCreationDate = new Date(creationDate * 1000).getTime();
  return (
    QUESTIONS_START_TIMESTAMP <= questionCreationDate &&
    questionCreationDate <= QUESTIONS_END_TIMESTAMP
  );
};

export const validateQuestionOwner = (
  questionOwnerId: number,
  participantIds: number[],
): boolean => !participantIds.includes(questionOwnerId);

export function validateTeamMembers(
  users: any,
  teamMembers: Participant[],
): void {
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
}
