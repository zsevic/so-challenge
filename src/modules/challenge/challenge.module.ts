import { Module } from '@nestjs/common';
import { ChallengeRepository } from './challenge.repository';
import { ChallengeService } from './challenge.service';

@Module({
  providers: [ChallengeService, ChallengeRepository],
  exports: [ChallengeService, ChallengeRepository],
})
export class ChallengeModule {}
