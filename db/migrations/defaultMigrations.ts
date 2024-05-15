import { MigrationInterface, QueryRunner } from 'typeorm';

export class LocalMigrations1715769943645 implements MigrationInterface {
  name = 'LocalMigrations1715769943645';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "phone_number" character varying NOT NULL, "address" character varying NOT NULL, "password" character varying NOT NULL, "role" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `INSERT INTO "users" VALUES (1, 'admin@thefirm.tech', 'thefirm', 'thefirm', '09123456789', 'Philippines', '$2b$10$rp2KHAd7qkkqBAVITJP6t.5EQbNpOxNvlHtmMEaNkAtzLB0FMRdaC', 1, '2024-05-15 10:55:36.279821', '2024-05-15 10:55:36.279821')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
