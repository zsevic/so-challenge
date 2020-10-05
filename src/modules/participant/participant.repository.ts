import { BadRequestException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { EntityRepository, Repository } from 'typeorm';
import { Participant } from './dto';
import { ParticipantEntity } from './participant.entity';

@EntityRepository(ParticipantEntity)
export class ParticipantRepository extends Repository<ParticipantEntity> {
  async bulkCreateParticipants(
    participantList: Participant[],
  ): Promise<Participant[]> {
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
    const newParticipants = participantList.map(
      (participant: Participant, index: number): Participant => ({
        ...participant,
        id: participants.identifiers[index].id,
      }),
    );

    return plainToClass(Participant, newParticipants);
  }
}
