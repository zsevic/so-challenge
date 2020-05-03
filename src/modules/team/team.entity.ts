import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MemberEntity } from 'modules/member/member.entity';

@Entity('team')
export class TeamEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  name: string;

  @Column({
    default: 0,
  })
  score: number;

  @OneToMany(
    () => MemberEntity,
    memberEntity => memberEntity.team,
  )
  members: MemberEntity[];
}
