import { Participant } from 'modules/participant/participant.payload';
import { Team } from './team.payload';

export type InitData = {
  participants: Record<string, Participant>;
  participantList: Participant[];
  teams: Record<string, Team>;
  teamList: Team[];
};
