import { MigrationInterface, QueryRunner } from 'typeorm';

export class LocalMigrations1715769943648 implements MigrationInterface {
  name = 'LocalMigrations1715769943648';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "game_image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "resolution" character varying NOT NULL, "uri" character varying NOT NULL, "game_id" uuid, CONSTRAINT "PK_d41575f07137f0e9890b032a38b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_game_image_game_id_resolution" ON "game_image" ("game_id", "resolution") `,
    );
    await queryRunner.query(`CREATE INDEX "idx_game_image_game_id" ON "game_image" ("game_id") `);
    await queryRunner.query(
      `CREATE TABLE "game" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "code" character varying NOT NULL, "category" character varying NOT NULL, "provider_code" character varying NOT NULL, "is_provider_in_maintenance" boolean NOT NULL, "jackpot_class" character varying NOT NULL, "jackpot_contribution" integer NOT NULL, "is_demo_allowed" boolean NOT NULL, "is_freeround_supported" boolean NOT NULL, "rtp" integer NOT NULL, CONSTRAINT "UQ_f66209e3c441170db9824c9e891" UNIQUE ("code"), CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "idx_game_code" ON "game" ("code") `);
    await queryRunner.query(
      `CREATE TYPE "public"."coin_transaction_type_enum" AS ENUM('DEBIT', 'CREDIT')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."coin_transaction_type_category_enum" AS ENUM('DEPOSIT', 'REBATE', 'REFUND', 'CASH_BACK', 'BET_DEBIT', 'WIN', 'PAYOUT', 'BET', 'TIP', 'PARTIAL_REFUND', 'BUY_IN', 'CASH_OUT', 'FREEROUND_WIN', 'TOURNAMENT_WIN', 'CAMPAIGN_WIN', 'FREEGAME_WIN', 'CONFISCATE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "coin_transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "note" character varying NOT NULL DEFAULT '', "type" "public"."coin_transaction_type_enum" NOT NULL DEFAULT 'DEBIT', "type_category" "public"."coin_transaction_type_category_enum" NOT NULL DEFAULT 'DEPOSIT', "amount" numeric(18,8) NOT NULL, "round_id" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "cash_transaction_id" uuid, "game_id" uuid, "user_player_id" uuid, "created_by_id" uuid, CONSTRAINT "PK_038fe0990ab9f6c09993c7761ea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_coin_transaction_game_id" ON "coin_transaction" ("game_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_coin_transaction_user_player_id_type_id" ON "coin_transaction" ("user_player_id", "type") `,
    );
    await queryRunner.query(
      `CREATE TABLE "payment_channel" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL DEFAULT '', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "created_by_id" uuid, "updated_by_id" uuid, CONSTRAINT "UQ_197a99efb311a9f24706e33bfb2" UNIQUE ("name"), CONSTRAINT "PK_f280a94d71fb8ec321a3a7a1208" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."cash_transaction_type_enum" AS ENUM('DEBIT', 'CREDIT')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."cash_transaction_type_category_enum" AS ENUM('DEPOSIT', 'REBATE', 'REFUND', 'CASH_BACK', 'BET_DEBIT', 'WIN', 'PAYOUT', 'BET', 'TIP', 'PARTIAL_REFUND', 'BUY_IN', 'CASH_OUT', 'FREEROUND_WIN', 'TOURNAMENT_WIN', 'CAMPAIGN_WIN', 'FREEGAME_WIN', 'CONFISCATE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "cash_transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "note" character varying NOT NULL DEFAULT '', "type" "public"."cash_transaction_type_enum" NOT NULL DEFAULT 'DEBIT', "type_category" "public"."cash_transaction_type_category_enum" NOT NULL DEFAULT 'DEPOSIT', "amount" numeric(18,8) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "user_player_id" uuid, "payment_channel_id" uuid, "created_by_id" uuid, CONSTRAINT "PK_d4d82b6912d82a7f4f519bd0d86" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "permission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "code" character varying NOT NULL, "description" character varying NOT NULL DEFAULT '', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "created_by_id" uuid, "updated_by_id" uuid, CONSTRAINT "UQ_30e166e8c6359970755c5727a23" UNIQUE ("code"), CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL DEFAULT '', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "created_by_id" uuid, "updated_by_id" uuid, CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "phone_number" character varying NOT NULL, "address" character varying NOT NULL, "coin_deposit" numeric(18,8) NOT NULL DEFAULT '0', "password" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deactivated_at" TIMESTAMP WITH TIME ZONE, "activated_at" TIMESTAMP WITH TIME ZONE, "created_by_id" uuid, "updated_by_id" uuid, "deactivated_by_id" uuid, "activated_by_id" uuid, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_user_email_first_name_last_name_phone_number_created_at" ON "user" ("first_name", "last_name", "phone_number", "created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_user_email_first_name_last_name_phone_number" ON "user" ("first_name", "last_name", "phone_number") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user_role" ("user_id" uuid NOT NULL, "role_id" uuid NOT NULL, CONSTRAINT "PK_f634684acb47c1a158b83af5150" PRIMARY KEY ("user_id", "role_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "auth" ("user_id" uuid NOT NULL, "access_token" character varying NOT NULL, "refresh_token" character varying NOT NULL, CONSTRAINT "PK_9922406dc7d70e20423aeffadf3" PRIMARY KEY ("user_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "role_permission" ("role_id" uuid NOT NULL, "permission_id" uuid NOT NULL, CONSTRAINT "PK_19a94c31d4960ded0dcd0397759" PRIMARY KEY ("role_id", "permission_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3d0a7155eafd75ddba5a701336" ON "role_permission" ("role_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e3a3ba47b7ca00fd23be4ebd6c" ON "role_permission" ("permission_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d0e5815877f7395a198a4cb0a4" ON "user_role" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_32a6fc2fcb019d8e3a8ace0f55" ON "user_role" ("role_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "game_image" ADD CONSTRAINT "FK_3fb15621133985aa37e6318ed19" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "coin_transaction" ADD CONSTRAINT "FK_7ba1299eb0d050da6b9f78971a6" FOREIGN KEY ("cash_transaction_id") REFERENCES "cash_transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "coin_transaction" ADD CONSTRAINT "FK_a3a204ff85e67240c2f93eb7720" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "coin_transaction" ADD CONSTRAINT "FK_9e13e6b1e1e3c8815de42aeed15" FOREIGN KEY ("user_player_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "coin_transaction" ADD CONSTRAINT "FK_becc40d1d633c36916da858e5b5" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_channel" ADD CONSTRAINT "FK_3446f926695c9b6dc9393a85858" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_channel" ADD CONSTRAINT "FK_ec4b96ff769b6a4a469dd43a9de" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cash_transaction" ADD CONSTRAINT "FK_79bf308e1f99c88834b943278f6" FOREIGN KEY ("user_player_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cash_transaction" ADD CONSTRAINT "FK_612a340c4e61196646a71eafe25" FOREIGN KEY ("payment_channel_id") REFERENCES "payment_channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cash_transaction" ADD CONSTRAINT "FK_d6a07ed6ba24ce4ee3523e1b942" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "permission" ADD CONSTRAINT "FK_0e65d1f8b3cf7bef8f47b0e5bcc" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "permission" ADD CONSTRAINT "FK_bce01da30939f991292e607078e" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD CONSTRAINT "FK_db92db78f9478b3e2fea19934b3" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD CONSTRAINT "FK_41385dfda73d566335406898746" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_b489bba7c2e3d5afcd98a445ff8" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_7a4f92de626d8dc4b05f06ad181" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_1ca4322739d8e1101b0bb655d71" FOREIGN KEY ("deactivated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_f5cfe53ba9f38fc26dafa29500f" FOREIGN KEY ("activated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role" ADD CONSTRAINT "FK_d0e5815877f7395a198a4cb0a46" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role" ADD CONSTRAINT "FK_32a6fc2fcb019d8e3a8ace0f55f" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission" ADD CONSTRAINT "FK_3d0a7155eafd75ddba5a7013368" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission" ADD CONSTRAINT "FK_e3a3ba47b7ca00fd23be4ebd6cf" FOREIGN KEY ("permission_id") REFERENCES "permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`
        INSERT INTO "user" 
        (
        "id", 
        "email", 
        "first_name", 
        "last_name", 
        "phone_number", 
        "address", 
        "password",
        "created_by_id",
        "updated_by_id"
        ) 
        VALUES 
        (
        '008347f6-0c9b-41e1-86bc-19978e9de440', 
        'admin@thefirm.tech', 
        'The', 
        'Firm', 
        '+639394252236', 
        'Philippines', 
        '$2a$10$35llA99Kf0S5bnYRyFdrtuk/uQjJOXoZLy0RxNe9bOOtY0t0o12Jy',
        '008347f6-0c9b-41e1-86bc-19978e9de440', 
        '008347f6-0c9b-41e1-86bc-19978e9de440'
        );
    `);

    await queryRunner.query(`
      INSERT INTO "payment_channel"
      (
        "id",
        "name",
        "description",
        "created_by_id",
        "updated_by_id"
      )
      VALUES
      (
        'b2de9197-4d7b-4947-bb15-e2d228b444d4',
        'Gcash',
        'payment through gcash',
        '008347f6-0c9b-41e1-86bc-19978e9de440',
        '008347f6-0c9b-41e1-86bc-19978e9de440'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role_permission" DROP CONSTRAINT "FK_e3a3ba47b7ca00fd23be4ebd6cf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission" DROP CONSTRAINT "FK_3d0a7155eafd75ddba5a7013368"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role" DROP CONSTRAINT "FK_32a6fc2fcb019d8e3a8ace0f55f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role" DROP CONSTRAINT "FK_d0e5815877f7395a198a4cb0a46"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_f5cfe53ba9f38fc26dafa29500f"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_1ca4322739d8e1101b0bb655d71"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_7a4f92de626d8dc4b05f06ad181"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_b489bba7c2e3d5afcd98a445ff8"`);
    await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "FK_41385dfda73d566335406898746"`);
    await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "FK_db92db78f9478b3e2fea19934b3"`);
    await queryRunner.query(
      `ALTER TABLE "permission" DROP CONSTRAINT "FK_bce01da30939f991292e607078e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "permission" DROP CONSTRAINT "FK_0e65d1f8b3cf7bef8f47b0e5bcc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cash_transaction" DROP CONSTRAINT "FK_d6a07ed6ba24ce4ee3523e1b942"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cash_transaction" DROP CONSTRAINT "FK_612a340c4e61196646a71eafe25"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cash_transaction" DROP CONSTRAINT "FK_79bf308e1f99c88834b943278f6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_channel" DROP CONSTRAINT "FK_ec4b96ff769b6a4a469dd43a9de"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_channel" DROP CONSTRAINT "FK_3446f926695c9b6dc9393a85858"`,
    );
    await queryRunner.query(
      `ALTER TABLE "coin_transaction" DROP CONSTRAINT "FK_becc40d1d633c36916da858e5b5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "coin_transaction" DROP CONSTRAINT "FK_9e13e6b1e1e3c8815de42aeed15"`,
    );
    await queryRunner.query(
      `ALTER TABLE "coin_transaction" DROP CONSTRAINT "FK_a3a204ff85e67240c2f93eb7720"`,
    );
    await queryRunner.query(
      `ALTER TABLE "coin_transaction" DROP CONSTRAINT "FK_7ba1299eb0d050da6b9f78971a6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "game_image" DROP CONSTRAINT "FK_3fb15621133985aa37e6318ed19"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_32a6fc2fcb019d8e3a8ace0f55"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_d0e5815877f7395a198a4cb0a4"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_e3a3ba47b7ca00fd23be4ebd6c"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_3d0a7155eafd75ddba5a701336"`);
    await queryRunner.query(`DROP TABLE "role_permission"`);
    await queryRunner.query(`DROP TABLE "auth"`);
    await queryRunner.query(`DROP TABLE "user_role"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_user_email_first_name_last_name_phone_number"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_user_email_first_name_last_name_phone_number_created_at"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "role"`);
    await queryRunner.query(`DROP TABLE "permission"`);
    await queryRunner.query(`DROP TABLE "cash_transaction"`);
    await queryRunner.query(`DROP TYPE "public"."cash_transaction_type_category_enum"`);
    await queryRunner.query(`DROP TYPE "public"."cash_transaction_type_enum"`);
    await queryRunner.query(`DROP TABLE "payment_channel"`);
    await queryRunner.query(`DROP INDEX "public"."idx_coin_transaction_user_player_id_type_id"`);
    await queryRunner.query(`DROP INDEX "public"."idx_coin_transaction_game_id"`);
    await queryRunner.query(`DROP TABLE "coin_transaction"`);
    await queryRunner.query(`DROP TYPE "public"."coin_transaction_type_category_enum"`);
    await queryRunner.query(`DROP TYPE "public"."coin_transaction_type_enum"`);
    await queryRunner.query(`DROP INDEX "public"."idx_game_code"`);
    await queryRunner.query(`DROP TABLE "game"`);
    await queryRunner.query(`DROP INDEX "public"."idx_game_image_game_id"`);
    await queryRunner.query(`DROP INDEX "public"."idx_game_image_game_id_resolution"`);
    await queryRunner.query(`DROP TABLE "game_image"`);
  }
}
