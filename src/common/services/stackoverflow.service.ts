import axios from 'axios';
import {
  getAnswersUrl,
  getQuestionUrl,
  getUsernames,
  validateAnswerCreationDate,
  validateMemberName,
  validateQuestionOwner,
  validateQuestionCreationDate,
  validateEditedAnswer,
} from 'common/utils';
import { Member } from 'modules/member/member.payload';
import { Team } from 'modules/team/team.payload';
import { TAGS } from 'common/config/constants';

export async function populateLeaderboard(
  teamList: Team[],
  memberList: Member[],
): Promise<void> {
  const usernames = getUsernames(memberList);

  const members = {};
  memberList.forEach((member: Member): void => {
    members[member.username] = member;
    members[member.username].score = 0;
    members[member.username].username = +member.username;
  });
  const teams = {};
  teamList.forEach((team: Team): void => {
    teams[team.id] = team;
    teams[team.id].score = 0;
  });

  const answersUrl = getAnswersUrl(usernames);
  const result = await axios.get(answersUrl);

  result.data.items.forEach(
    async (answer): Promise<void> => {
      const member = members[answer.owner.user_id];
      console.log(member);
      const isValidMember = validateMemberName(
        member.name,
        answer.owner.display_name,
      );
      const isValidAnswerCreationDate =
        answer.creation_date &&
        validateAnswerCreationDate(answer.creation_date);
      const isValidAnswerLastEditDate = !answer.last_edit_date
        ? true
        : validateEditedAnswer(answer.last_edit_date);

      if (
        isValidMember &&
        isValidAnswerCreationDate &&
        isValidAnswerLastEditDate
      ) {
        const response = await axios.get(getQuestionUrl(answer.question_id));
        const question = response.data.items[0];

        const questionOwnerId = question.owner.user_id;
        const containsValidTag = question.tags.some(tag => TAGS.includes(tag));
        const isMemberQuestionOwner = validateQuestionOwner(
          member.username,
          questionOwnerId,
        );
        const isValidQuestionCreationDate =
          question.creation_date &&
          validateQuestionCreationDate(question.creation_date);

        if (
          containsValidTag &&
          !isMemberQuestionOwner &&
          isValidQuestionCreationDate
        ) {
          member.score += answer.score;
          member.link = answer.owner.link;
          console.log(question.title, member);
          teams[member.team_id].score += answer.score;
        }
      }
    },
  );
}
