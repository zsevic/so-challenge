import { Type } from 'class-transformer';
import { Member } from 'modules/member/member.payload';

export class Team {
  id?: string;

  name: string;

  @Type(() => Member)
  members: Member[];

  score?: number;

  updated_at?: string;
}
