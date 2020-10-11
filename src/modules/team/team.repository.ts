import { BadRequestException, Logger } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { methodTransformToDto } from 'common/decorators';
import { PaginatedResponse, PaginationDto } from 'common/dtos';
import { Participant } from 'modules/participant/dto';
import { Team } from './dto';
import { TeamEntity } from './team.entity';

@EntityRepository(TeamEntity)
export class TeamRepository extends Repository<TeamEntity> {
  private readonly logger = new Logger(TeamRepository.name);

  @methodTransformToDto(Team)
  async createTeam(name: string): Promise<TeamEntity> {
    const team = await this.findOne({ name });
    if (team) {
      throw new BadRequestException(`Team with name "${name}" is registered`);
    }

    try {
      return this.save({ name });
    } catch (error) {
      this.logger.error(error.message);
      throw new BadRequestException(
        `Team with name ${name} is already registered`,
      );
    }
  }

  @methodTransformToDto(Team)
  async getAll(): Promise<TeamEntity[]> {
    return this.createQueryBuilder('team')
      .leftJoinAndSelect('team.members', 'member')
      .orderBy('team.score', 'DESC')
      .orderBy('member.score', 'DESC')
      .getMany();
  }

  @methodTransformToDto(Team, true)
  async getTeamList(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const skippedItems = (page - 1) * limit;
    const totalCount = await this.count();

    const teamList = await this.createQueryBuilder('team')
      .leftJoinAndSelect('team.members', 'member')
      .orderBy('team.score', 'DESC')
      .skip(skippedItems)
      .take(limit)
      .getMany();
    const data = teamList.map(
      (team: TeamEntity): TeamEntity => ({
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
