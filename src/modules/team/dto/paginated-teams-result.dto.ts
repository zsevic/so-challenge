import { Team } from 'modules/team/dto';

export class PaginatedTeamsResultDto {
  data: Team[];
  page: number;
  limit: number;
  totalCount: number;
}
