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
      `CREATE TABLE "game" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "code" character varying NOT NULL, "category" character varying NOT NULL, "provider_code" character varying NOT NULL, "is_provider_in_maintenance" boolean NOT NULL, "jackpot_class" character varying NOT NULL, "jackpot_contribution" integer, "is_demo_allowed" boolean NOT NULL, "is_freeround_supported" boolean NOT NULL, "rtp" integer NOT NULL, CONSTRAINT "UQ_f66209e3c441170db9824c9e891" UNIQUE ("code"), CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "idx_game_code" ON "game" ("code") `);
    await queryRunner.query(`CREATE INDEX "idx_game_category" ON "game" ("category") `);
    await queryRunner.query(
      `CREATE INDEX "idx_game_name_category" ON "game" ("name", "category") `,
    );
    await queryRunner.query(
      `CREATE TABLE "payment_channel" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL DEFAULT '', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "created_by_id" uuid, "updated_by_id" uuid, CONSTRAINT "UQ_197a99efb311a9f24706e33bfb2" UNIQUE ("name"), CONSTRAINT "PK_f280a94d71fb8ec321a3a7a1208" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."coin_transaction_type_enum" AS ENUM('DEBIT', 'CREDIT')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."coin_transaction_type_category_enum" AS ENUM('DEPOSIT', 'REBATE', 'REFUND', 'ROLL_BACK', 'CASH_BACK', 'BET_DEBIT', 'WIN', 'LOSS', 'PAYOUT', 'BET', 'WITHDRAW', 'TIP', 'PARTIAL_REFUND', 'BUY_IN', 'CASH_OUT', 'FREEROUND_WIN', 'TOURNAMENT_WIN', 'CAMPAIGN_WIN', 'FREEGAME_WIN', 'CONFISCATE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "coin_transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "note" character varying NOT NULL DEFAULT '', "type" "public"."coin_transaction_type_enum" NOT NULL DEFAULT 'DEBIT', "type_category" "public"."coin_transaction_type_category_enum" NOT NULL DEFAULT 'DEPOSIT', "amount" numeric(18,8) NOT NULL, "transaction_id" character varying, "round_id" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "coin_transaction_id" uuid, "payment_channel_id" uuid, "game_id" uuid, "user_player_id" uuid, "created_by_id" uuid, CONSTRAINT "PK_038fe0990ab9f6c09993c7761ea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "fk_cash_transaction_round_id" ON "coin_transaction" ("round_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_coin_transaction_game_id" ON "coin_transaction" ("game_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_coin_transaction_transaction_id_type" ON "coin_transaction" ("transaction_id", "type") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_coin_transaction_user_player_id_type_id" ON "coin_transaction" ("user_player_id", "type") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."coin_request_status_enum" AS ENUM('PENDING', 'APPROVED', 'REJECTED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."coin_request_type_enum" AS ENUM('WITHDRAW', 'DEPOSIT')`,
    );
    await queryRunner.query(
      `CREATE TABLE "coin_request" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "note" character varying NOT NULL DEFAULT '', "status" "public"."coin_request_status_enum" NOT NULL DEFAULT 'PENDING', "type" "public"."coin_request_type_enum" NOT NULL, "amount" integer NOT NULL, "actioned_at" TIMESTAMP, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "coin_transaction_id" uuid, "requesting_user_id" uuid, "reviewing_user_id" uuid, "action_agent_id" uuid, CONSTRAINT "PK_6727f0a839e7e463a3f36ab7a46" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "fk_coin_request_action_agent_id" ON "coin_request" ("action_agent_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "fk_coin_request_reviewing_user_id" ON "coin_request" ("reviewing_user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "fk_coin_request_requesting_user_id" ON "coin_request" ("requesting_user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "fk_coin_request_coin_transaction_id" ON "coin_request" ("coin_transaction_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "game_session" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "user_id" uuid, CONSTRAINT "PK_58b630233711ccafbb0b2a904fc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "fb_game_session_user_id" ON "game_session" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user_tawk" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "property_id" character varying NOT NULL, "widget_id" character varying NOT NULL, CONSTRAINT "PK_cd333c55e14cb5662361fdbf112" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "phone_number" character varying NOT NULL, "address" character varying NOT NULL, "coin_deposit" numeric(18,8) NOT NULL DEFAULT '0', "password" character varying NOT NULL, "is_owner" boolean NOT NULL DEFAULT false, "is_admin" boolean NOT NULL DEFAULT false, "is_city_manager" boolean NOT NULL DEFAULT false, "is_master_agent" boolean NOT NULL DEFAULT false, "is_agent" boolean NOT NULL DEFAULT false, "is_player" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deactivated_at" TIMESTAMP WITH TIME ZONE, "activated_at" TIMESTAMP WITH TIME ZONE, "tawk_id" uuid, "parentId" uuid, "updated_by_id" uuid, "deactivated_by_id" uuid, "activated_by_id" uuid, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_user_email_first_name_last_name_phone_number_created_at" ON "user" ("first_name", "last_name", "phone_number", "created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_user_email_first_name_last_name_phone_number" ON "user" ("first_name", "last_name", "phone_number") `,
    );
    await queryRunner.query(
      `CREATE INDEX "fk_user_activated_by_id" ON "user" ("activated_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "fk_user_deactivated_by_id" ON "user" ("deactivated_by_id") `,
    );
    await queryRunner.query(`CREATE INDEX "fk_user_updated_by_id" ON "user" ("updated_by_id") `);
    await queryRunner.query(`CREATE INDEX "fk_user_parent" ON "user" ("parentId") `);
    await queryRunner.query(`CREATE INDEX "fk_user_isPlayer" ON "user" ("is_player") `);
    await queryRunner.query(`CREATE INDEX "fk_user_isAgent" ON "user" ("is_agent") `);
    await queryRunner.query(`CREATE INDEX "fk_user_isMasterAgent" ON "user" ("is_master_agent") `);
    await queryRunner.query(`CREATE INDEX "fk_user_isCityManager" ON "user" ("is_city_manager") `);
    await queryRunner.query(`CREATE INDEX "fk_user_isAdmin" ON "user" ("is_admin") `);
    await queryRunner.query(`CREATE INDEX "fk_user_isOwner" ON "user" ("is_owner") `);
    await queryRunner.query(
      `CREATE TABLE "auth" ("user_id" uuid NOT NULL, "access_token" character varying NOT NULL, "refresh_token" character varying NOT NULL, CONSTRAINT "PK_9922406dc7d70e20423aeffadf3" PRIMARY KEY ("user_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_closure" ("id_ancestor" uuid NOT NULL, "id_descendant" uuid NOT NULL, CONSTRAINT "PK_117e57e38a6cabe49d52592c939" PRIMARY KEY ("id_ancestor", "id_descendant"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_dcba9530799a881bdb55f5080b" ON "user_closure" ("id_ancestor") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_45880eda1f98d31b4400d153a4" ON "user_closure" ("id_descendant") `,
    );
    await queryRunner.query(
      `ALTER TABLE "game_image" ADD CONSTRAINT "FK_3fb15621133985aa37e6318ed19" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_channel" ADD CONSTRAINT "FK_3446f926695c9b6dc9393a85858" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_channel" ADD CONSTRAINT "FK_ec4b96ff769b6a4a469dd43a9de" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "coin_transaction" ADD CONSTRAINT "FK_6ca6f2b31dac3439e14f5458b33" FOREIGN KEY ("coin_transaction_id") REFERENCES "coin_transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "coin_transaction" ADD CONSTRAINT "FK_bdd143ec3582b69c15eb0558dff" FOREIGN KEY ("payment_channel_id") REFERENCES "payment_channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "coin_request" ADD CONSTRAINT "FK_87794c73600c17477600748883d" FOREIGN KEY ("coin_transaction_id") REFERENCES "coin_transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "coin_request" ADD CONSTRAINT "FK_ee6fead258f8697f46c2cca1461" FOREIGN KEY ("requesting_user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "coin_request" ADD CONSTRAINT "FK_7351269d275fa85f9141f26dac8" FOREIGN KEY ("reviewing_user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "coin_request" ADD CONSTRAINT "FK_939e3ff9d7e7bbdbfc0fdbb6580" FOREIGN KEY ("action_agent_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "game_session" ADD CONSTRAINT "FK_e771dcf69ac8e0a2cfe4da708f2" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_cd333c55e14cb5662361fdbf112" FOREIGN KEY ("tawk_id") REFERENCES "user_tawk"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_c86f56da7bb30c073e3cbed4e50" FOREIGN KEY ("parentId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "user_closure" ADD CONSTRAINT "FK_dcba9530799a881bdb55f5080bd" FOREIGN KEY ("id_ancestor") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_closure" ADD CONSTRAINT "FK_45880eda1f98d31b4400d153a4c" FOREIGN KEY ("id_descendant") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_closure" DROP CONSTRAINT "FK_45880eda1f98d31b4400d153a4c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_closure" DROP CONSTRAINT "FK_dcba9530799a881bdb55f5080bd"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_f5cfe53ba9f38fc26dafa29500f"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_1ca4322739d8e1101b0bb655d71"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_7a4f92de626d8dc4b05f06ad181"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c86f56da7bb30c073e3cbed4e50"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_cd333c55e14cb5662361fdbf112"`);
    await queryRunner.query(
      `ALTER TABLE "game_session" DROP CONSTRAINT "FK_e771dcf69ac8e0a2cfe4da708f2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "coin_request" DROP CONSTRAINT "FK_939e3ff9d7e7bbdbfc0fdbb6580"`,
    );
    await queryRunner.query(
      `ALTER TABLE "coin_request" DROP CONSTRAINT "FK_7351269d275fa85f9141f26dac8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "coin_request" DROP CONSTRAINT "FK_ee6fead258f8697f46c2cca1461"`,
    );
    await queryRunner.query(
      `ALTER TABLE "coin_request" DROP CONSTRAINT "FK_87794c73600c17477600748883d"`,
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
      `ALTER TABLE "coin_transaction" DROP CONSTRAINT "FK_bdd143ec3582b69c15eb0558dff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "coin_transaction" DROP CONSTRAINT "FK_6ca6f2b31dac3439e14f5458b33"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_channel" DROP CONSTRAINT "FK_ec4b96ff769b6a4a469dd43a9de"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_channel" DROP CONSTRAINT "FK_3446f926695c9b6dc9393a85858"`,
    );
    await queryRunner.query(
      `ALTER TABLE "game_image" DROP CONSTRAINT "FK_3fb15621133985aa37e6318ed19"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_45880eda1f98d31b4400d153a4"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_dcba9530799a881bdb55f5080b"`);
    await queryRunner.query(`DROP TABLE "user_closure"`);
    await queryRunner.query(`DROP TABLE "auth"`);
    await queryRunner.query(`DROP INDEX "public"."fk_user_isOwner"`);
    await queryRunner.query(`DROP INDEX "public"."fk_user_isAdmin"`);
    await queryRunner.query(`DROP INDEX "public"."fk_user_isCityManager"`);
    await queryRunner.query(`DROP INDEX "public"."fk_user_isMasterAgent"`);
    await queryRunner.query(`DROP INDEX "public"."fk_user_isAgent"`);
    await queryRunner.query(`DROP INDEX "public"."fk_user_isPlayer"`);
    await queryRunner.query(`DROP INDEX "public"."fk_user_parent"`);
    await queryRunner.query(`DROP INDEX "public"."fk_user_updated_by_id"`);
    await queryRunner.query(`DROP INDEX "public"."fk_user_deactivated_by_id"`);
    await queryRunner.query(`DROP INDEX "public"."fk_user_activated_by_id"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_user_email_first_name_last_name_phone_number"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_user_email_first_name_last_name_phone_number_created_at"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "user_tawk"`);
    await queryRunner.query(`DROP INDEX "public"."fb_game_session_user_id"`);
    await queryRunner.query(`DROP TABLE "game_session"`);
    await queryRunner.query(`DROP INDEX "public"."fk_coin_request_coin_transaction_id"`);
    await queryRunner.query(`DROP INDEX "public"."fk_coin_request_requesting_user_id"`);
    await queryRunner.query(`DROP INDEX "public"."fk_coin_request_reviewing_user_id"`);
    await queryRunner.query(`DROP INDEX "public"."fk_coin_request_action_agent_id"`);
    await queryRunner.query(`DROP TABLE "coin_request"`);
    await queryRunner.query(`DROP TYPE "public"."coin_request_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."coin_request_status_enum"`);
    await queryRunner.query(`DROP INDEX "public"."idx_coin_transaction_user_player_id_type_id"`);
    await queryRunner.query(`DROP INDEX "public"."idx_coin_transaction_transaction_id_type"`);
    await queryRunner.query(`DROP INDEX "public"."idx_coin_transaction_game_id"`);
    await queryRunner.query(`DROP INDEX "public"."fk_cash_transaction_round_id"`);
    await queryRunner.query(`DROP TABLE "coin_transaction"`);
    await queryRunner.query(`DROP TYPE "public"."coin_transaction_type_category_enum"`);
    await queryRunner.query(`DROP TYPE "public"."coin_transaction_type_enum"`);
    await queryRunner.query(`DROP TABLE "payment_channel"`);
    await queryRunner.query(`DROP INDEX "public"."idx_game_name_category"`);
    await queryRunner.query(`DROP INDEX "public"."idx_game_category"`);
    await queryRunner.query(`DROP INDEX "public"."idx_game_code"`);
    await queryRunner.query(`DROP TABLE "game"`);
    await queryRunner.query(`DROP INDEX "public"."idx_game_image_game_id"`);
    await queryRunner.query(`DROP INDEX "public"."idx_game_image_game_id_resolution"`);
    await queryRunner.query(`DROP TABLE "game_image"`);
  }
}
