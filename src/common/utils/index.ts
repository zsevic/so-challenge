import {
  ANSWERS_FROM_DATE,
  ANSWERS_TO_DATE,
  QUESTIONS_FROM_DATE,
  QUESTIONS_TO_DATE,
  LEADERBOARD_END_YEAR,
  LEADERBOARD_END_MONTH,
  LEADERBOARD_END_DAY,
  LEADERBOARD_END_HOURS,
  LEADERBOARD_END_MINUTES,
} from 'common/config/constants';
import { Member } from 'modules/member/member.payload';
import { Team } from 'modules/team/team.payload';

export const getAnswersUrl = (usernames: string): string =>
  `https://api.stackexchange.com/2.2/users/${usernames}/answers?site=stackoverflow&fromdate=${ANSWERS_FROM_DATE}&todate=${ANSWERS_TO_DATE}`;

export const getQuestionUrl = (questionIds: string): string =>
  `https://api.stackexchange.com/2.2/questions/${questionIds}?site=stackoverflow&fromdate=${QUESTIONS_FROM_DATE}&todate=${QUESTIONS_TO_DATE}`;

export const getUsernames = (memberList: Member[]): string =>
  memberList.map((member: Member): number => member.username).join(';');

export const isCronJobFinished = () =>
  new Date(
    LEADERBOARD_END_YEAR,
    LEADERBOARD_END_MONTH,
    LEADERBOARD_END_DAY,
    LEADERBOARD_END_HOURS,
    LEADERBOARD_END_MINUTES,
  ).getTime() <= new Date().getTime();

type Init = {
  members: Record<number, Member>;
  teams: Record<number, Team>;
};

export const initialize = (memberList: Member[], teamList: Team[]): Init => {
  const members = {};
  memberList.forEach((member: Member): void => {
    const username = +member.username;
    members[username] = member;
    members[username].score = 0;
    members[username].username = +member.username;
  });
  const teams = {};
  teamList.forEach((team: Team): void => {
    const id = team.id;
    teams[id] = team;
    teams[id].score = 0;
  });
  return { members, teams };
};
