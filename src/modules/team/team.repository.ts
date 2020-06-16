import { BadRequestException, Logger } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { EntityRepository, Repository } from 'typeorm';
import { Participant } from 'modules/participant/participant.payload';
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

  async getTeamList(
    paginationDto: PaginationDto,
  ): Promise<PaginatedTeamsResultDto> {
    const { page, limit } = paginationDto;
    const skippedItems = (page - 1) * limit;
    const totalCount = await this.count();

    const teamList = await this.createQueryBuilder('team')
      .leftJoinAndSelect('team.members', 'member')
      .orderBy('team.score', 'DESC')
      .skip(skippedItems)
      .take(limit)
      .getMany();
    const data = plainToClass(Team, teamList).map(
      (team: Team): Team => ({
        ...team,
        members: team.members.sort(
          (firstMember: Participant, secondMember: Participant): number =>
            secondMember.score - firstMember.score,
        ),
      }),
    );

    return {
      totalCount,
      page,
      limit,
      data,
    };
  }
}
