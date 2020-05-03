import { Body, Controller, Post, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateTeamDto } from './dto';
import { Team } from './team.payload';
import { TeamService } from './team.service';

@Controller('teams')
@ApiTags('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get('leaderboard')
  async getLeaderboard(): Promise<Team[]> {
    return this.teamService.getLeaderboard();
  }

  @Get()
  async getTeamList(): Promise<Team[]> {
    return this.teamService.getTeamList();
  }

  @Post()
  async registerTeam(@Body() teamDto: CreateTeamDto): Promise<Team> {
    return this.teamService.createTeam(teamDto);
  }
}
