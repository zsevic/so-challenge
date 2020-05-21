import { BadRequestException, Logger } from '@nestjs/common';
import axios from 'axios';
import { getParticipantStackoverflowIds, getUsersUrl } from 'common/utils';
import {
  validateAnswerCreationDate,
  validateEditedAnswer,
  validateParticipantName,
  validateTeamMembers,
} from 'common/utils/validations';
import { Participant } from 'modules/participant/participant.payload';
import { Team } from 'modules/team/team.payload';

export function getAnsweredQuestions(
  participants: Record<string, Participant>,
  answers: any,
): Record<string, any> {
  const answeredQuestions = {};

  answers.forEach(answer => {
    const participant = participants[answer.owner.user_id];
    const isValidParticipant = validateParticipantName(
      participant.name,
      answer.owner.display_name,
    );
    const isValidAnswerCreationDate =
      answer.creation_date && validateAnswerCreationDate(answer.creation_date);
    const isValidAnswerLastEditDate = !answer.last_edit_date
      ? true
      : validateEditedAnswer(answer.last_edit_date);

    if (
      isValidParticipant &&
      isValidAnswerCreationDate &&
      isValidAnswerLastEditDate
    ) {
      const questionId = +answer.question_id;
      if (!answeredQuestions[answer.question_id]) {
        answeredQuestions[questionId] = {
          [answer.owner.user_id]: answer,
        };
      } else {
        answeredQuestions[questionId][answer.owner.user_id] = answer;
      }
    }
  });
  return answeredQuestions;
}

export async function validateTeam(team: Team): Promise<void> {
  const logger = new Logger(validateTeam.name);
  const participantStackoverflowIds = getParticipantStackoverflowIds(
    team.members,
  );
  const participants = await axios
    .get(getUsersUrl(participantStackoverflowIds))
    .then(response => {
      logger.debug(
        `get users, remaining requests: ${response.data.quota_remaining}`,
      );
      return response.data.items;
    })
    .catch(err => {
      logger.error(`get users error: ${err}`);
      throw new BadRequestException(err);
    });
  validateTeamMembers(participants, team.members);
}
