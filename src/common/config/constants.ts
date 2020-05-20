import { getQueryParameterDateFormat } from 'common/utils';

export const ANSWER_START_YEAR = 2010;
export const ANSWER_START_MONTH = 3; // +1
export const ANSWER_START_DAY = 10;
export const ANSWER_START_HOURS = 3;
export const ANSWER_START_MINUTES = 0;

export const ANSWER_END_YEAR = 2020;
export const ANSWER_END_MONTH = 4; // +1
export const ANSWER_END_DAY = 11;
export const ANSWER_END_HOURS = 16;
export const ANSWER_END_MINUTES = 0;

export const ANSWERS_FROM_DATE = getQueryParameterDateFormat(
  ANSWER_START_YEAR,
  ANSWER_START_MONTH,
  ANSWER_START_DAY,
);
export const ANSWERS_TO_DATE = getQueryParameterDateFormat(
  ANSWER_END_YEAR,
  ANSWER_END_MONTH,
  ANSWER_END_DAY,
);

export const QUESTION_START_YEAR = 2010;
export const QUESTION_START_MONTH = 0; // +1
export const QUESTION_START_DAY = 10;
export const QUESTION_START_HOURS = 3;
export const QUESTION_START_MINUTES = 0;

export const QUESTION_END_YEAR = 2020;
export const QUESTION_END_MONTH = 4; // +1
export const QUESTION_END_DAY = 11;
export const QUESTION_END_HOURS = 16;
export const QUESTION_END_MINUTES = 0;

export const QUESTIONS_FROM_DATE = getQueryParameterDateFormat(
  QUESTION_START_YEAR,
  QUESTION_START_MONTH,
  QUESTION_START_DAY,
);
export const QUESTIONS_TO_DATE = getQueryParameterDateFormat(
  QUESTION_END_YEAR,
  QUESTION_END_MONTH,
  QUESTION_END_DAY,
);

export const LEADERBOARD_END_YEAR = 2021;
export const LEADERBOARD_END_MONTH = 3; // +1
export const LEADERBOARD_END_DAY = 24;
export const LEADERBOARD_END_HOURS = 16;
export const LEADERBOARD_END_MINUTES = 0;

export const REGISTRATION_END_YEAR = 2020;
export const REGISTRATION_END_MONTH = 8; // +1
export const REGISTRATION_END_DAY = 24;
export const REGISTRATION_END_HOURS = 16;
export const REGISTRATION_END_MINUTES = 0;

export const TAGS = [];

export const ANSWERS_BATCH_SIZE = 100;
export const QUESTIONS_BATCH_SIZE = 100;

export const ANSWERS_PAGE_SIZE = 100;
export const QUESTIONS_PAGE_SIZE = 100;
