import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsActiveTagging1723125487540 implements MigrationInterface {
    name = 'AddIsActiveTagging1723125487540'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" ADD "is_active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "provider" ADD "is_active" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "provider" DROP COLUMN "is_active"`);
        await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "is_active"`);
    }

}
