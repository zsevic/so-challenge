import { Type } from 'class-transformer';
import { Participant } from 'modules/participant/participant.payload';

export class Team {
  id?: string;

  name: string;

  @Type(() => Participant)
  members: Participant[];

  score?: number;

  updated_at?: string;
}
