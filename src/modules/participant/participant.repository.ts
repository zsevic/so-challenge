import { BadRequestException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { ParticipantEntity } from './participant.entity';
import { Participant } from './participant.payload';

@EntityRepository(ParticipantEntity)
export class ParticipantRepository extends Repository<ParticipantEntity> {
  async bulkCreateParticipants(
    participantList: Participant[],
    manager: EntityManager,
  ): Promise<Participant[]> {
    const participants = await manager
      .createQueryBuilder(ParticipantEntity, 'participant')
      .insert()
      .into(ParticipantEntity)
      .values(participantList)
      .execute()
      .catch(() => {
        throw new BadRequestException(
          'Participant Stackoverflow IDs are not valid',
        );
      });
    const newParticipants = participantList.map(
      (participant: Participant, index: number): Participant => ({
        ...participant,
        id: participants.identifiers[index].id,
      }),
    );

    return plainToClass(Participant, newParticipants);
  }
}
