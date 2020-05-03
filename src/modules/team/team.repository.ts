import { BadRequestException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { EntityRepository, Repository, EntityManager } from 'typeorm';
import { TeamEntity } from './team.entity';
import { Team } from './team.payload';

@EntityRepository(TeamEntity)
export class TeamRepository extends Repository<TeamEntity> {
  async createTeam(name: string, manager: EntityManager): Promise<Team> {
    const team = await manager.save(TeamEntity, { name }).catch(() => {
      throw new BadRequestException('Team name is taken');
    });

    return plainToClass(Team, team);
  }

  async getTeamList(): Promise<Team[]> {
    const teamList = await this.find({
      relations: ['members'],
      order: {
        score: 'DESC',
      },
    });

    return plainToClass(Team, teamList);
  }
}
