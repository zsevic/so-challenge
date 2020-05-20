import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ParticipantEntity } from 'modules/participant/participant.entity';

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
    type: 'int',
  })
  score: number;

  @OneToMany(
    () => ParticipantEntity,
    participantEntity => participantEntity.team,
  )
  members: ParticipantEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
