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
    const updated_at = teams?.[0].updated_at
      ? new Date(teams[0].updated_at).toLocaleString()
      : new Date().toLocaleString();
    return {
      teams,
      title: 'SO challenge - Leaderboard',
      page: 'leaderboard',
      updated_at,
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
