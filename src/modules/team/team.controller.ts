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
    return { teams, title: 'SO challenge - Leaderboard', page: 'leaderboard' };
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
  @Render('registration')
  async registerTeam(@Body() teamDto: CreateTeamDto) {
    await this.teamService.createTeam(teamDto);
    return { title: 'SO challenge - registration', page: 'registration' };
  }
}
