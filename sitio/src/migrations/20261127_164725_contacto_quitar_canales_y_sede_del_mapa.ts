import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "inicio_blocks_contacto" DROP CONSTRAINT "inicio_blocks_contacto_sede_del_mapa_id_sedes_id_fk";
  
  DROP INDEX "inicio_blocks_contacto_sede_del_mapa_idx";
  ALTER TABLE "inicio_blocks_contacto" DROP COLUMN "canales_whatsapp";
  ALTER TABLE "inicio_blocks_contacto" DROP COLUMN "canales_llamada";
  ALTER TABLE "inicio_blocks_contacto" DROP COLUMN "canales_correo";
  ALTER TABLE "inicio_blocks_contacto" DROP COLUMN "sede_del_mapa_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "inicio_blocks_contacto" ADD COLUMN "canales_whatsapp" varchar DEFAULT 'WhatsApp';
  ALTER TABLE "inicio_blocks_contacto" ADD COLUMN "canales_llamada" varchar DEFAULT 'Llámanos';
  ALTER TABLE "inicio_blocks_contacto" ADD COLUMN "canales_correo" varchar DEFAULT 'Correo';
  ALTER TABLE "inicio_blocks_contacto" ADD COLUMN "sede_del_mapa_id" integer;
  ALTER TABLE "inicio_blocks_contacto" ADD CONSTRAINT "inicio_blocks_contacto_sede_del_mapa_id_sedes_id_fk" FOREIGN KEY ("sede_del_mapa_id") REFERENCES "public"."sedes"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "inicio_blocks_contacto_sede_del_mapa_idx" ON "inicio_blocks_contacto" USING btree ("sede_del_mapa_id");`)
}
