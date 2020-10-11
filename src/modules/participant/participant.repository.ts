import { BadRequestException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { classTransformToDto } from 'common/decorators';
import { Participant } from './dto';
import { ParticipantEntity } from './participant.entity';

@EntityRepository(ParticipantEntity)
@classTransformToDto(Participant)
export class ParticipantRepository extends Repository<ParticipantEntity> {
  async bulkCreateParticipants(
    participantList: Participant[],
  ): Promise<ParticipantEntity[]> {
    const participants = await this.createQueryBuilder('participant')
      .insert()
      .into(ParticipantEntity)
      .values(participantList)
      .execute()
      .catch(() => {
        throw new BadRequestException(
          'Participant Stackoverflow IDs are not valid',
        );
      });

    return participantList.map(
      (participant: ParticipantEntity, index: number): ParticipantEntity => ({
        ...participant,
        id: participants.identifiers[index].id,
      }),
    );
  }
}
