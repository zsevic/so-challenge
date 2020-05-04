import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTeam1588624260549 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'team',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'score',
            type: 'number',
          },
          {
            name: 'created_at',
            type: 'Date',
          },
          {
            name: 'updated_at',
            type: 'Date',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('team');
  }
}
