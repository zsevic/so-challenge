import { Controller, Get, Render } from '@nestjs/common';
import {
  CHALLENGE_START_TIMESTAMP,
  CHALLENGE_END_TIMESTAMP,
  LEADERBOARD_UPDATING_END_TIMESTAMP,
  QUESTIONS_START_TIMESTAMP,
  QUESTIONS_END_TIMESTAMP,
  REGISTRATION_END_TIMESTAMP,
} from 'modules/challenge/challenge.constants';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  root() {
    return {
      challengeStart: new Date(CHALLENGE_START_TIMESTAMP).toLocaleString(),
      challengeEnd: new Date(CHALLENGE_END_TIMESTAMP).toLocaleString(),
      leaderboardUpdatingEnd: new Date(
        LEADERBOARD_UPDATING_END_TIMESTAMP,
      ).toLocaleString(),
      questionsEnd: new Date(QUESTIONS_END_TIMESTAMP).toLocaleString(),
      questionsStart: new Date(QUESTIONS_START_TIMESTAMP).toLocaleString(),
      registrationEnd: new Date(REGISTRATION_END_TIMESTAMP).toLocaleString(),
      title: 'SO challenge',
    };
  }
}
