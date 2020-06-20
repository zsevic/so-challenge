import { formatDistanceToNow } from 'date-fns';
import { Pagination } from 'common/types';
import { PaginationDto } from 'modules/team/dto';

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

export const getPaginationData = (
  paginationDto: PaginationDto,
  totalCount: number,
): Pagination => {
  const { page: currentPage, limit: pageSize } = paginationDto;
  const hasNextPage = pageSize * currentPage < totalCount;
  const hasPreviousPage = currentPage > 1;

  return {
    currentPage,
    pageSize,
    hasMoreThanOnePage: hasNextPage || hasPreviousPage,
    hasNextPage,
    hasPreviousPage,
    nextPage: currentPage + 1,
    previousPage: currentPage - 1,
    lastPage: Math.ceil(totalCount / pageSize),
  };
};

export const splitBy = (size: number, array: number[]): number[][] =>
  array.reduce(
    (acc: number[][], _: number, index: number, self: number[]) =>
      !(index % size) ? [...acc, self.slice(index, index + size)] : acc,
    [],
  );
