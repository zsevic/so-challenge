import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { formatDistanceToNow } from 'date-fns';
import { Response } from 'express';
import { isRegistrationEnded } from 'common/utils';
import { CreateTeamDto } from './dto';
import { Team } from './team.payload';
import { TeamService } from './team.service';

@Controller()
@ApiTags('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get('leaderboard')
  async leaderboard(@Res() res: Response) {
    const data = {
      title: 'SO challenge - Leaderboard',
      page: 'leaderboard',
    };
    const teams = await this.teamService.getLeaderboard();
    if (teams.length === 0) {
      return res.render('leaderboard-no-teams', data);
    }

    const lastUpdatedTeam = teams.reduce(
      (acc: Team, current: Team): Team =>
        new Date(acc.updated_at).getTime() <
        new Date(current.updated_at).getTime()
          ? current
          : acc,
    );
    const lastUpdate = formatDistanceToNow(
      new Date(lastUpdatedTeam.updated_at),
    );

    return res.render('leaderboard', {
      ...data,
      teams,
      lastUpdate,
    });
  }

  @Get('teams')
  async getTeamList(): Promise<Team[]> {
    return this.teamService.getTeamList();
  }

  @Get('registration')
  async registration(@Res() res: Response) {
    const data = {
      title: 'SO challenge - Registration',
      page: 'registration',
    };
    if (isRegistrationEnded()) {
      return res.render('registration-ended', data);
    }
    return res.render('registration', data);
  }

  @Post('teams')
  async registerTeam(@Body() teamDto: CreateTeamDto): Promise<Team> {
    if (isRegistrationEnded()) {
      throw new BadRequestException('Registration is ended');
    }
    return this.teamService.createTeam(teamDto);
  }
}
