export type Pagination = {
  currentPage: number;
  pageSize: number;
  hasMoreThanOnePage: boolean;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number;
  previousPage: number;
  lastPage: number;
};
