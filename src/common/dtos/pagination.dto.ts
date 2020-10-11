import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
} from 'modules/team/team.constants';

export class PaginationDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit = DEFAULT_PAGE_SIZE;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page = DEFAULT_PAGE_NUMBER;
}
