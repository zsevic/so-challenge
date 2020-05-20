import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NameTransformer } from 'modules/participant/transformers/name.transformer';
import { TeamEntity } from 'modules/team/team.entity';

@Entity('participant')
export class ParticipantEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
    type: 'int',
  })
  stackoverflow_id: number;

  @Column()
  team_id: string;

  @Column({
    nullable: true,
  })
  link: string;

  @Column({
    transformer: new NameTransformer(),
  })
  name: string;

  @Column({
    default: 0,
    type: 'int',
  })
  score: number;

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
