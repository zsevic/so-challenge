import { Team } from 'modules/team/team.payload';

export class PaginatedTeamsResultDto {
  data: Team[];
  page: number;
  limit: number;
  totalCount: number;
}
