import { MigrationInterface, QueryRunner } from 'typeorm';
import { ParticipantEntity } from 'modules/participant/participant.entity';

export class SeedParticipant1588624539696 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.insert(ParticipantEntity, [
      {
        id: '69bfce33-e233-48e7-8a68-e5420082d851',
        team_id: '45e13bd0-47af-40df-95c4-b9fe91efdca5',
        link: '',
        name: 'Burtie Arends',
        score: 0,
        stackoverflow_id: 2190929,
      },
      {
        id: 'd4971dd9-6bba-4937-b9d3-246aca9d3ede',
        team_id: '45e13bd0-47af-40df-95c4-b9fe91efdca5',
        link: '',
        name: 'Željko Šević',
        score: 0,
        stackoverflow_id: 8381015,
      },
      {
        id: '3a435463-2200-4538-aaa3-b377be527d1d',
        team_id: '45e13bd0-47af-40df-95c4-b9fe91efdca5',
        link: '',
        name: 'Jeff',
        score: 0,
        stackoverflow_id: 234003,
      },
      {
        id: 'e768f4a5-b87d-42f4-ae78-cd154846ed39',
        team_id: '45e13bd0-47af-40df-95c4-b9fe91efdca5',
        link: '',
        name: 'Steel',
        score: 0,
        stackoverflow_id: 235313,
      },
      {
        id: '55be4f25-36d0-447b-8e3e-c297ac647026',
        team_id: '370b670e-6d78-44de-be26-3d3af4d02faf',
        link: '',
        name: 'user235254',
        score: 0,
        stackoverflow_id: 235254,
      },
      {
        id: '613dd7e4-50a1-4f27-a0a7-f572ac27e268',
        team_id: '370b670e-6d78-44de-be26-3d3af4d02faf',
        link: '',
        name: 'user235384',
        score: 0,
        stackoverflow_id: 235384,
      },
      {
        id: 'c51555dd-4e44-4259-a89a-f5f82b4b599e',
        team_id: '370b670e-6d78-44de-be26-3d3af4d02faf',
        link: '',
        name: 'Andy LifeBrixx',
        score: 0,
        stackoverflow_id: 335384,
      },
      {
        id: 'bb5eaae1-85d4-4a20-993f-132ade4ebc74',
        team_id: '370b670e-6d78-44de-be26-3d3af4d02faf',
        link: '',
        name: 'MachoGeek',
        score: 0,
        stackoverflow_id: 324784,
      },
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.clear(ParticipantEntity);
  }
}
