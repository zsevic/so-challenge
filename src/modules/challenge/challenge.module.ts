import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParticipantRepository } from 'modules/participant/participant.repository';
import { TeamRepository } from 'modules/team/team.repository';
import { ChallengeRepository } from './challenge.repository';
import { ChallengeService } from './challenge.service';

@Module({
  imports: [TypeOrmModule.forFeature([ParticipantRepository, TeamRepository])],
  providers: [ChallengeService, ChallengeRepository],
  exports: [ChallengeService, ChallengeRepository],
})
export class ChallengeModule {}
