import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberRepository } from 'modules/member/member.repository';
import { TeamController } from './team.controller';
import { TeamRepository } from './team.repository';
import { TeamService } from './team.service';

@Module({
  imports: [TypeOrmModule.forFeature([MemberRepository, TeamRepository])],
  providers: [TeamService],
  controllers: [TeamController],
})
export class TeamModule {}
