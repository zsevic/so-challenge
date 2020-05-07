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
  ANSWERS_FROM_DATE,
  ANSWERS_TO_DATE,
  QUESTIONS_FROM_DATE,
  QUESTIONS_TO_DATE,
} from 'common/config/constants';
import { Member } from 'modules/member/member.payload';

export const getAnswersUrl = (usernames: string): string =>
  `https://api.stackexchange.com/2.2/users/${usernames}/answers?site=stackoverflow&fromdate=${ANSWERS_FROM_DATE}&todate=${ANSWERS_TO_DATE}`;

export const getQuestionUrl = (questionId: number): string =>
  `https://api.stackexchange.com/2.2/questions/${questionId}?site=stackoverflow&fromdate=${QUESTIONS_FROM_DATE}&todate=${QUESTIONS_TO_DATE}`;

export const getUsernames = (memberList: Member[]): string =>
  memberList.map((member: Member): number => member.username).join(';');

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
  memberId: number,
  questionOwnerId,
): boolean => memberId === questionOwnerId;
