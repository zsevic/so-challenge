import { BadRequestException, Logger } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { EntityRepository, Repository, EntityManager } from 'typeorm';
import { TeamEntity } from './team.entity';
import { Team } from './team.payload';

@EntityRepository(TeamEntity)
export class TeamRepository extends Repository<TeamEntity> {
  private readonly logger = new Logger(TeamRepository.name);

  async createTeam(name: string, manager: EntityManager): Promise<Team> {
    const team = await manager.findOne(TeamEntity, { name });
    if (team) {
      throw new BadRequestException(`Team with name "${name}" is registered`);
    }

    const createdTeam = await manager
      .save(TeamEntity, { name })
      .catch((err: Error): void => {
        this.logger.error(err.message);
        throw new BadRequestException(
          `Team with name ${name} is already registered`,
        );
      });

    return plainToClass(Team, createdTeam);
  }

  async getTeamList(): Promise<Team[]> {
    const teamList = await this.createQueryBuilder('team')
      .leftJoinAndSelect('team.members', 'member')
      .orderBy('team.score', 'DESC')
      .orderBy('member.score', 'DESC')
      .getMany();

    return plainToClass(Team, teamList);
  }
}
