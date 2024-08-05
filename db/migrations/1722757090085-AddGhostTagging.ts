import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGhostTagging1722757090085 implements MigrationInterface {
    name = 'AddGhostTagging1722757090085'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "is_ghost" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ADD "is_direct_line" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "is_direct_line"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "is_ghost"`);
    }

}
