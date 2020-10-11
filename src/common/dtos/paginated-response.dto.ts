export class PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  totalCount: number;
}
