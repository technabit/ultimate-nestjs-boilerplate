import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1746266963362 implements MigrationInterface {
  name = 'Init1746266963362';

  public async up(queryRunner: QueryRunner): Promise<void> {}

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
