import { parse } from 'url';
import { BadRequestException, Logger } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { getParticipantStackoverflowIds, getUsersUrl } from 'common/utils';
import {
  validateAnswerCreationDate,
  validateEditedAnswer,
  validateParticipantName,
  validateTeamMembers,
} from 'common/utils/validations';
import { Participant } from 'modules/participant/participant.payload';
import { Team } from 'modules/team/team.payload';

export async function getData(
  apiCalls: Promise<AxiosResponse<any>>[],
  data = [],
): Promise<any> {
  const logger = new Logger(getData.name);
  const newApiCalls = [];
  try {
    const responses = await Promise.all(apiCalls);
    const result = responses.map(response => {
      const { url } = response.config;
      const urlPath = url.split('?')[0];
      if (response.data.has_more) {
        const { query } = parse(url, true);
        const page = +query.page + 1 + '';
        const queryParameters = new URLSearchParams({
          ...query,
          page,
        });
        const apiUrl = urlPath + '?' + queryParameters.toString();

        newApiCalls.push(axios.get(apiUrl));
      }
      const resource =
        urlPath.split('/').slice(-1)[0] === 'answers' ? 'answers' : 'questions';
      logger.debug(
        `get ${resource}, length: ${response.data.items.length}, has more: ${response.data.has_more},
      remaining requests: ${response.data.quota_remaining}`,
      );
      return response.data.items;
    });
    const newData = data.concat(...result);

    return newApiCalls.length > 0 ? getData(newApiCalls, newData) : newData;
  } catch (err) {
    logger.error(`get data error: ${err}`);
    throw new BadRequestException(err);
  }
}

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
