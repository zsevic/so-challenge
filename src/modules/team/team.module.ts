import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParticipantRepository } from 'modules/participant/participant.repository';
import { StackoverflowModule } from 'modules/stackoverflow/stackoverflow.module';
import { TeamController } from './team.controller';
import { TeamRepository } from './team.repository';
import { TeamService } from './team.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ParticipantRepository, TeamRepository]),
    StackoverflowModule,
  ],
  providers: [TeamService],
  controllers: [TeamController],
})
export class TeamModule {}
