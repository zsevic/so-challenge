import { formatDistanceToNow } from 'date-fns';
import { Participant } from 'modules/participant/participant.payload';
import { Team } from 'modules/team/team.payload';

export function getQueryParameterDateFormat(
  year: number,
  month: number,
  day: number,
): string {
  const monthValue = month < 9 ? `0${month + 1}` : month + 1;
  return `${year}-${monthValue}-${day}`;
}

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

const getEndPrefix = (date: number): string =>
  date <= new Date().getTime() ? 'ended' : 'ends';

export const getEnd = (endDate: number): string => {
  const distance = formatDistanceToNow(endDate, {
    addSuffix: true,
  });
  const prefix = getEndPrefix(endDate);

  return `${prefix} ${distance}`;
};

export const splitBy = (size: number, array: number[]): number[][] =>
  array.reduce(
    (acc: number[][], _: number, index: number, self: number[]) =>
      !(index % size) ? [...acc, self.slice(index, index + size)] : acc,
    [],
  );
