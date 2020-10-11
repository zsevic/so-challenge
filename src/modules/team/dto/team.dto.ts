import { Type } from 'class-transformer';
import { Participant } from 'modules/participant/dto';

export class Team {
  id?: string;

  name: string;

  @Type(() => Participant)
  members?: Participant[];

  score?: number;
}
