import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateMember1588624270243 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'member',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'team_id',
            type: 'uuid',
          },
          {
            name: 'link',
            type: 'varchar',
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
            name: 'username',
            type: 'varchar',
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
    await queryRunner.dropTable('member');
  }
}
