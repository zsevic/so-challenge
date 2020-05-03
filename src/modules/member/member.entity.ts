import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TeamEntity } from 'modules/team/team.entity';

@Entity('member')
export class MemberEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  team_id: string;

  @Column()
  name: string;

  @Column({
    default: 0,
  })
  score: number;

  @Column({
    unique: true,
  })
  username: number;

  @ManyToOne(
    () => TeamEntity,
    teamEntity => teamEntity.members,
  )
  @JoinColumn({ name: 'team_id' })
  team: TeamEntity;
}
