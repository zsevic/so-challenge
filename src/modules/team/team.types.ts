import { Participant } from 'modules/participant/dto';
import { Team } from './dto';

export type InitData = {
  participants: Record<string, Participant>;
  participantList: Participant[];
  teams: Record<string, Team>;
  teamList: Team[];
};
