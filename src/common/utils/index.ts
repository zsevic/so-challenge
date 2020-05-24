import { formatDistanceToNow } from 'date-fns';

export function getQueryParameterDateFormat(
  year: number,
  month: number,
  day: number,
): string {
  const monthValue = month < 9 ? `0${month + 1}` : month + 1;
  return `${year}-${monthValue}-${day}`;
}

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
