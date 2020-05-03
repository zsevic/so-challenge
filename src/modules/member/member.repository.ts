import { plainToClass } from 'class-transformer';
import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { MemberEntity } from './member.entity';
import { Member } from './member.payload';
import { BadRequestException } from '@nestjs/common';

@EntityRepository(MemberEntity)
export class MemberRepository extends Repository<MemberEntity> {
  async bulkCreateMembers(
    memberList: Member[],
    manager: EntityManager,
  ): Promise<Member[]> {
    const members = await manager
      .createQueryBuilder(MemberEntity, 'member')
      .insert()
      .into(MemberEntity)
      .values(memberList)
      .execute()
      .catch(() => {
        throw new BadRequestException('Member username is taken');
      });
    const newMembers = memberList.map(
      (member: Member, index): Member => ({
        ...member,
        id: members.identifiers[index].id,
      }),
    );

    return plainToClass(Member, newMembers);
  }
}
