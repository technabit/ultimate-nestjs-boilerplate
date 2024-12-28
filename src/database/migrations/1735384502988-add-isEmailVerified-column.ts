import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsEmailVerifiedColumn1735384502988
  implements MigrationInterface
{
  name = 'AddIsEmailVerifiedColumn1735384502988';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "isEmailVerified" boolean NOT NULL DEFAULT false
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "isEmailVerified"
        `);
  }
}
