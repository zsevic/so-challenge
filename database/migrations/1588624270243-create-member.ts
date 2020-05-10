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
            default: 'uuid_generate_v4()',
            generationStrategy: 'uuid',
            isGenerated: true,
            isPrimary: true,
          },
          {
            name: 'team_id',
            type: 'uuid',
          },
          {
            name: 'link',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'score',
            type: 'int',
            default: 0,
          },
          {
            name: 'username',
            type: 'int',
            isUnique: true,
          },
          {
            name: 'created_at',
            type: 'Date',
            default: 'current_timestamp',
          },
          {
            name: 'updated_at',
            type: 'Date',
            default: 'current_timestamp',
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
