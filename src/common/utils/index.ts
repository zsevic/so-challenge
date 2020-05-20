import { formatDistanceToNow } from 'date-fns';
import {
  ANSWERS_FROM_DATE,
  ANSWERS_TO_DATE,
  ANSWERS_PAGE_SIZE,
  LEADERBOARD_END_YEAR,
  LEADERBOARD_END_MONTH,
  LEADERBOARD_END_DAY,
  LEADERBOARD_END_HOURS,
  LEADERBOARD_END_MINUTES,
  QUESTIONS_FROM_DATE,
  QUESTIONS_TO_DATE,
  QUESTIONS_PAGE_SIZE,
  REGISTRATION_END_YEAR,
  REGISTRATION_END_MONTH,
  REGISTRATION_END_DAY,
  REGISTRATION_END_HOURS,
  REGISTRATION_END_MINUTES,
} from 'common/config/constants';
import { Participant } from 'modules/participant/participant.payload';
import { Team } from 'modules/team/team.payload';

export const getAnswersUrl = (
  usernames: string,
  pagesize = ANSWERS_PAGE_SIZE,
  page = 1,
): string =>
  `https://api.stackexchange.com/2.2/users/${usernames}/answers?site=stackoverflow&fromdate=${ANSWERS_FROM_DATE}&todate=${ANSWERS_TO_DATE}&page=${page}&pagesize=${pagesize}`;

export const getQuestionsUrl = (
  questionsIds: string,
  pagesize = QUESTIONS_PAGE_SIZE,
  page = 1,
): string =>
  `https://api.stackexchange.com/2.2/questions/${questionsIds}?site=stackoverflow&fromdate=${QUESTIONS_FROM_DATE}&todate=${QUESTIONS_TO_DATE}&page=${page}&pagesize=${pagesize}`;

export const getUsersUrl = (usernames: string): string =>
  `https://api.stackexchange.com/2.2/users/${usernames}?site=stackoverflow`;

export const getParticipantStackoverflowIds = (
  participantList: Participant[],
): string =>
  participantList
    .map((participant: Participant): number => participant.stackoverflow_id)
    .join(';');

export const getQueryParameterDateFormat = (
  year: number,
  month: number,
  day: number,
): string => {
  const monthValue = month < 9 ? `0${month + 1}` : month + 1;
  return `${year}-${monthValue}-${day}`;
};

export const LEADERBOARD_END = new Date(
  LEADERBOARD_END_YEAR,
  LEADERBOARD_END_MONTH,
  LEADERBOARD_END_DAY,
  LEADERBOARD_END_HOURS,
  LEADERBOARD_END_MINUTES,
).getTime();

export const REGISTRATION_END = new Date(
  REGISTRATION_END_YEAR,
  REGISTRATION_END_MONTH,
  REGISTRATION_END_DAY,
  REGISTRATION_END_HOURS,
  REGISTRATION_END_MINUTES,
).getTime();

export const isCronJobFinished = (): boolean =>
  LEADERBOARD_END <= new Date().getTime();

export const isRegistrationEnded = (): boolean =>
  REGISTRATION_END <= new Date().getTime();

type Init = {
  participants: Record<number, Participant>;
  teams: Record<number, Team>;
};

export const initialize = (
  participantList: Participant[],
  teamList: Team[],
): Init => {
  const participants = {};
  participantList.forEach((participant: Participant): void => {
    const id = +participant.stackoverflow_id;
    participants[id] = participant;
    participants[id].score = 0;
    participants[id].stackoverflow_id = +participant.stackoverflow_id;
  });
  const teams = {};
  teamList.forEach((team: Team): void => {
    const id = team.id;
    teams[id] = team;
    teams[id].score = 0;
  });
  return { participants, teams };
};

const getPrefix = (date: number): string =>
  date <= new Date().getTime() ? 'ended' : 'ends';

export const getEnd = (endDate: number): string => {
  const distance = formatDistanceToNow(endDate, {
    addSuffix: true,
  });
  const prefix = getPrefix(endDate);

  return `${prefix} ${distance}`;
};

export const splitBy = (size: number, array: number[]): number[][] =>
  array.reduce(
    (acc: number[][], _: number, index: number, self: number[]) =>
      !(index % size) ? [...acc, self.slice(index, index + size)] : acc,
    [],
  );
