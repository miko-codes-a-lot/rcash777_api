import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterUserIsActivated1722257166820 implements MigrationInterface {
    name = 'AlterUserIsActivated1722257166820'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "is_activated" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "is_activated"`);
    }

}
