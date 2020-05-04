import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateTeamDto } from './dto';
import { Team } from './team.payload';
import { TeamService } from './team.service';

@Controller()
@ApiTags('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get('leaderboard')
  @Render('leaderboard')
  async leaderboard() {
    const teams = await this.teamService.getLeaderboard();
    let lastUpdate = '';
    if (teams.length > 0) {
      const lastUpdatedTeam = teams.reduce(
        (acc: Team, current: Team): Team =>
          new Date(acc.updated_at).getTime() <
          new Date(current.updated_at).getTime()
            ? current
            : acc,
      );
      lastUpdate = new Date(lastUpdatedTeam.updated_at).toLocaleString();
    }

    return {
      teams,
      title: 'SO challenge - Leaderboard',
      page: 'leaderboard',
      updated_at: lastUpdate,
    };
  }

  @Get('teams')
  async getTeamList(): Promise<Team[]> {
    return this.teamService.getTeamList();
  }

  @Get('registration')
  @Render('registration')
  async registration() {
    return {
      title: 'SO challenge - Registration',
      page: 'registration',
    };
  }

  @Post('teams')
  async registerTeam(@Body() teamDto: CreateTeamDto): Promise<Team> {
    return this.teamService.createTeam(teamDto);
  }
}
