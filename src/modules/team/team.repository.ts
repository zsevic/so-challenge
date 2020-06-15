import { BadRequestException, Logger } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { EntityRepository, Repository } from 'typeorm';
import { PaginatedTeamsResultDto, PaginationDto } from './dto';
import { TeamEntity } from './team.entity';
import { Team } from './team.payload';

@EntityRepository(TeamEntity)
export class TeamRepository extends Repository<TeamEntity> {
  private readonly logger = new Logger(TeamRepository.name);

  async createTeam(name: string): Promise<Team> {
    const team = await this.findOne({ name });
    if (team) {
      throw new BadRequestException(`Team with name "${name}" is registered`);
    }

    const createdTeam = await this.save({ name }).catch((err: Error): void => {
      this.logger.error(err.message);
      throw new BadRequestException(
        `Team with name ${name} is already registered`,
      );
    });

    return plainToClass(Team, createdTeam);
  }

  async getAll(): Promise<Team[]> {
    const teamList = await this.createQueryBuilder('team')
      .leftJoinAndSelect('team.members', 'member')
      .orderBy('team.score', 'DESC')
      .orderBy('member.score', 'DESC')
      .getMany();

    return plainToClass(Team, teamList);
  }

  async getTeamList(paginationDto: PaginationDto): Promise<PaginatedTeamsResultDto> {
    const { page, limit } = paginationDto;
    const skippedItems = (page - 1) * limit;
    const totalCount = await this.count();

    const teamList = await this.createQueryBuilder('team')
      .orderBy('team.score', 'DESC')
      .offset(skippedItems)
      .limit(limit)
      // .leftJoinAndSelect('team.members', 'member')
      // .orderBy('member.score', 'DESC')
      .getMany();

    return {
      totalCount,
      page,
      limit,
      data: plainToClass(Team, teamList),
    };
  }
}
