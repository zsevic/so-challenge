import { MigrationInterface, QueryRunner } from 'typeorm';
import { TeamEntity } from 'modules/team/team.entity';

export class SeedTeam1588624535712 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.insert(TeamEntity, [
      {
        id: '45e13bd0-47af-40df-95c4-b9fe91efdca5',
        name: 'team1',
      },
      {
        id: '370b670e-6d78-44de-be26-3d3af4d02faf',
        name: 'team2',
      },
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.clear(TeamEntity);
  }
}
