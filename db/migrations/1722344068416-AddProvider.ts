import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProvider1722344068416 implements MigrationInterface {
  name = 'AddProvider1722344068416';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "provider" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "code" character varying NOT NULL, "icon" character varying, CONSTRAINT "UQ_8da0db8c3fabde91d783af1fe09" UNIQUE ("code"), CONSTRAINT "PK_6ab2f66d8987bf1bfdd6136a2d5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "idx_provider_code" ON "provider" ("code") `);
    await queryRunner.query(`CREATE INDEX "idx_provider_name" ON "provider" ("name") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."idx_provider_name"`);
    await queryRunner.query(`DROP INDEX "public"."idx_provider_code"`);
    await queryRunner.query(`DROP TABLE "provider"`);
  }
}
