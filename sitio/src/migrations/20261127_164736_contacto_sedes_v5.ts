import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "inicio_blocks_contacto" ADD COLUMN "canales_como_llegar" varchar DEFAULT 'Cómo llegar';
  ALTER TABLE "inicio_blocks_contacto" ADD COLUMN "canales_foto_del_mapa_id" integer;
  ALTER TABLE "inicio_blocks_contacto" ADD CONSTRAINT "inicio_blocks_contacto_canales_foto_del_mapa_id_medios_id_fk" FOREIGN KEY ("canales_foto_del_mapa_id") REFERENCES "public"."medios"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "inicio_blocks_contacto_canales_canales_foto_del_mapa_idx" ON "inicio_blocks_contacto" USING btree ("canales_foto_del_mapa_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "inicio_blocks_contacto" DROP CONSTRAINT "inicio_blocks_contacto_canales_foto_del_mapa_id_medios_id_fk";
  
  DROP INDEX "inicio_blocks_contacto_canales_canales_foto_del_mapa_idx";
  ALTER TABLE "inicio_blocks_contacto" DROP COLUMN "canales_como_llegar";
  ALTER TABLE "inicio_blocks_contacto" DROP COLUMN "canales_foto_del_mapa_id";`)
}
