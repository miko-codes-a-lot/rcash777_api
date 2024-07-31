import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterGameRTPAndJackpotToDecimal1722446267266 implements MigrationInterface {
  name = 'AlterGameRTPAndJackpotToDecimal1722446267266';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "jackpot_contribution"`);
    await queryRunner.query(
      `ALTER TABLE "game" ADD "jackpot_contribution" numeric(5,2) DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "rtp"`);
    await queryRunner.query(`ALTER TABLE "game" ADD "rtp" numeric(5,2) NOT NULL DEFAULT '0'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "rtp"`);
    await queryRunner.query(`ALTER TABLE "game" ADD "rtp" integer NOT NULL`);
    await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "jackpot_contribution"`);
    await queryRunner.query(`ALTER TABLE "game" ADD "jackpot_contribution" integer`);
  }
}
