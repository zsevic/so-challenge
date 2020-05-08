import { Logger } from '@nestjs/common';
import axios from 'axios';
import { TAGS } from 'common/config/constants';
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

export async function populateLeaderboard(
  teamList: Team[],
  memberList: Member[],
): Promise<void> {
  const logger = new Logger(populateLeaderboard.name);
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

  const answers = await axios
    .get(answersUrl)
    .then(result => {
      logger.debug(
        `get answers, remaining requests: ${result.data.quota_remaining}`,
      );
      return result.data.items;
    })
    .catch(err => {
      logger.error('get answer', err);
      throw new Error(err);
    });
  let answerCounter = 0;

  return new Promise(
    async (resolve): Promise<void> => {
      answers.forEach(
        async (answer): Promise<void> => {
          const member = members[answer.owner.user_id];
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
            const questions = await axios
              .get(getQuestionUrl(answer.question_id))
              .then(response => {
                logger.debug(
                  `get question, remaining requests: ${response.data.quota_remaining}`,
                );
                return response.data.items;
              })
              .catch(err => {
                logger.error('get question', err);
                return false;
              });
            const question = questions[0];
            if (!question) {
              // TODO refactor
              answerCounter += 1;
              if (answerCounter === answers.length) {
                return resolve();
              }
              return;
            }

            const questionOwnerId = question.owner.user_id;
            const containsValidTag = question.tags.some(tag =>
              TAGS.includes(tag),
            );
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
              logger.debug(`${question.title}, score: ${answer.score}`);
              teams[member.team_id].score += answer.score;
            }
            answerCounter += 1;
            if (answerCounter === answers.length) {
              return resolve();
            }
            return;
          } else {
            answerCounter += 1;
            if (answerCounter === answers.length) {
              return resolve();
            }
          }
        },
      );
    },
  );
}
