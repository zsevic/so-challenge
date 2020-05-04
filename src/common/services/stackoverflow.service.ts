import axios from 'axios';
import { Member } from 'modules/member/member.payload';
import { Team } from 'modules/team/team.payload';

const apiTag = (usernames: string): string => {
  return `https://api.stackexchange.com/2.2/users/${usernames}/answers?site=stackoverflow`;
};

export async function populateLeaderboard(
  teamList: Team[],
  memberList: Member[],
): Promise<void> {
  const usernames = memberList
    .map((member: Member): number => member.username)
    .join(';');

  const members = {};
  memberList.forEach((member: Member): void => {
    members[member.username] = member;
    members[member.username].score = 0;
  });
  const teams = {};
  teamList.forEach((team: Team): void => {
    teams[team.id] = team;
    teams[team.id].score = 0;
  });

  const apiUrl = apiTag(usernames);

  const result = await axios.get(apiUrl);

  result.data.items.forEach((answer): void => {
    const member = members[answer.owner.user_id];
    if (member.name.localeCompare(answer.owner.display_name) === 0) {
      member.score += answer.score;
      teams[member.team_id].score += answer.score;
    }
  });
}
