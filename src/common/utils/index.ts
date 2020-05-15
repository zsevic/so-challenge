import { formatDistanceToNow } from 'date-fns';
import {
  ANSWERS_FROM_DATE,
  ANSWERS_TO_DATE,
  LEADERBOARD_END_YEAR,
  LEADERBOARD_END_MONTH,
  LEADERBOARD_END_DAY,
  LEADERBOARD_END_HOURS,
  LEADERBOARD_END_MINUTES,
  QUESTIONS_FROM_DATE,
  QUESTIONS_TO_DATE,
  REGISTRATION_END_YEAR,
  REGISTRATION_END_MONTH,
  REGISTRATION_END_DAY,
  REGISTRATION_END_HOURS,
  REGISTRATION_END_MINUTES,
} from 'common/config/constants';
import { Member } from 'modules/member/member.payload';
import { Team } from 'modules/team/team.payload';

export const getAnswersUrl = (usernames: string): string =>
  `https://api.stackexchange.com/2.2/users/${usernames}/answers?site=stackoverflow&fromdate=${ANSWERS_FROM_DATE}&todate=${ANSWERS_TO_DATE}`;

export const getQuestionsUrl = (questionsIds: string): string =>
  `https://api.stackexchange.com/2.2/questions/${questionsIds}?site=stackoverflow&fromdate=${QUESTIONS_FROM_DATE}&todate=${QUESTIONS_TO_DATE}`;

export const getUsersUrl = (usernames: string): string =>
  `https://api.stackexchange.com/2.2/users/${usernames}?site=stackoverflow`;

export const getUsernames = (memberList: Member[]): string =>
  memberList.map((member: Member): number => member.username).join(';');

export const isCronJobFinished = (): boolean =>
  new Date(
    LEADERBOARD_END_YEAR,
    LEADERBOARD_END_MONTH,
    LEADERBOARD_END_DAY,
    LEADERBOARD_END_HOURS,
    LEADERBOARD_END_MINUTES,
  ).getTime() <= new Date().getTime();

export const isRegistrationEnded = (): boolean =>
  new Date(
    REGISTRATION_END_YEAR,
    REGISTRATION_END_MONTH,
    REGISTRATION_END_DAY,
    REGISTRATION_END_HOURS,
    REGISTRATION_END_MINUTES,
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

export const getLeaderboardEnd = () => {
  const leaderboardEndDate = new Date(
    LEADERBOARD_END_YEAR,
    LEADERBOARD_END_MONTH,
    LEADERBOARD_END_DAY,
    LEADERBOARD_END_HOURS,
    LEADERBOARD_END_MINUTES,
  ).getTime();
  const leaderboardEndDistance = formatDistanceToNow(leaderboardEndDate, {
    addSuffix: true,
  });
  const leaderboardEndPrefix =
    leaderboardEndDate <= new Date().getTime() ? 'ended' : 'ends';
  return `${leaderboardEndPrefix} ${leaderboardEndDistance}`;
};
