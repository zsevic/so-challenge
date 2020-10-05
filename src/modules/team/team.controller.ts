import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { formatDistanceToNow } from 'date-fns';
import { Response } from 'express';
import { getEnd, getPaginationData } from 'common/utils';
import {
  LEADERBOARD_UPDATING_END_TIMESTAMP,
  REGISTRATION_END_TIMESTAMP,
} from 'modules/challenge/challenge.constants';
import { ChallengeService } from 'modules/challenge/challenge.service';
import { Participant } from 'modules/participant/dto';
import { CreateTeamDto, PaginatedTeamsResultDto, PaginationDto, Team } from './dto';
import { TeamService } from './team.service';

@Controller()
@ApiTags('teams')
export class TeamController {
  constructor(
    private readonly challengeService: ChallengeService,
    private readonly teamService: TeamService,
  ) {}

  @Get('leaderboard')
  async leaderboard(
    @Query() paginationDto: PaginationDto,
    @Res() res: Response,
  ) {
    const data = {
      title: 'SO challenge - Leaderboard',
      page: 'leaderboard',
    };
    const teams = await this.teamService.getTeamList(paginationDto);
    if (teams.data.length === 0) {
      return res.render('leaderboard-no-teams', data);
    }

    const lastUpdateDate = teams.data
      .map((team: Team): string => team.updated_at)
      .reduce((acc: string, current: string): string =>
        new Date(acc).getTime() < new Date(current).getTime() ? current : acc,
      );
    const lastUpdate = formatDistanceToNow(new Date(lastUpdateDate), {
      addSuffix: true,
    });
    const teamList =
      process.env.NODE_ENV === 'development'
        ? teams.data
        : teams.data.map(
            (team: Team): Team => ({
              ...team,
              members: team.members.map(
                (member: Participant): Participant => {
                  delete member.link;
                  delete member.stackoverflow_id;

                  return member;
                },
              ),
            }),
          );
    const leaderboardUpdatingEnd = getEnd(LEADERBOARD_UPDATING_END_TIMESTAMP);
    const paginationData = getPaginationData(paginationDto, teams.totalCount);

    return res.render('leaderboard', {
      ...data,
      teamList,
      lastUpdate,
      leaderboardUpdatingEnd,
      ...paginationData,
    });
  }

  @Get('teams')
  async getTeamList(
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedTeamsResultDto> {
    return this.teamService.getTeamList(paginationDto);
  }

  @Get('registration')
  async registration(@Res() res: Response) {
    const data = {
      title: 'SO challenge - Registration',
      page: 'registration',
    };
    const isRegistrationEnded = this.challengeService.validateIfRegistrationEnded();
    if (isRegistrationEnded) {
      return res.render('registration-ended', data);
    }
    const registrationEnd = getEnd(REGISTRATION_END_TIMESTAMP);

    return res.render('registration', {
      ...data,
      registrationEnd,
    });
  }

  @Post('teams')
  async registerTeam(@Body() teamDto: CreateTeamDto): Promise<Team> {
    const isRegistrationEnded = this.challengeService.validateIfRegistrationEnded();
    if (isRegistrationEnded) {
      throw new BadRequestException('Registration is ended');
    }
    await this.challengeService.validateTeam(teamDto);

    return this.teamService.createTeam(teamDto);
  }
}
