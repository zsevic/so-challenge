import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TeamEntity } from 'modules/team/team.entity';

@Entity('member')
export class MemberEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  team_id: string;

  @Column({
    nullable: true,
  })
  link: string;

  @Column()
  name: string;

  @Column({
    default: 0,
    type: 'int',
  })
  score: number;

  @Column({
    unique: true,
    type: 'int',
  })
  username: number;

  @ManyToOne(
    () => TeamEntity,
    teamEntity => teamEntity.members,
  )
  @JoinColumn({ name: 'team_id' })
  team: TeamEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
