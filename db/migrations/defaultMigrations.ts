import { MigrationInterface, QueryRunner } from 'typeorm';

export class LocalMigrations1715769943648 implements MigrationInterface {
  name = 'LocalMigrations1715769943648';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "phone_number" character varying NOT NULL, "address" character varying NOT NULL, "password" character varying NOT NULL, "role" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "auth" ("user_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "access_token" character varying NOT NULL, "refresh_token" character varying NOT NULL, CONSTRAINT "PK_9922406dc7d70e20423aeffadf3" PRIMARY KEY ("user_id"))`,
    );
    await queryRunner.query(
      `INSERT INTO "user" VALUES ('008347f6-0c9b-41e1-86bc-19978e9de440', 'admin@thefirm.tech', 'thefirm', 'thefirm', '09123456789', 'Philippines', '$2b$10$rp2KHAd7qkkqBAVITJP6t.5EQbNpOxNvlHtmMEaNkAtzLB0FMRdaC', 1, '2024-05-15 10:55:36.279821', '2024-05-15 10:55:36.279821')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "auth"`);
  }
}
