import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_inclusiones_de_plan_tipo" AS ENUM('incluido', 'no-incluido', 'texto');
  CREATE TYPE "public"."enum_valores_icono" AS ENUM('pulgar', 'trofeo', 'foco', 'candado', 'balanza', 'equipo');
  CREATE TYPE "public"."enum_vencimientos_periodicidad" AS ENUM('mensual', 'anual');
  CREATE TYPE "public"."enum_publicaciones_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__publicaciones_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_etiquetas_color" AS ENUM('azul', 'verde', 'rojo', 'amarillo', 'morado', 'gris');
  CREATE TYPE "public"."enum_mensajes_de_contacto_estado" AS ENUM('nuevo', 'atendido');
  CREATE TYPE "public"."enum_usuarios_rol" AS ENUM('administrador', 'editor');
  CREATE TYPE "public"."enum_inicio_blocks_carrusel_portadas_acciones_tipo" AS ENUM('whatsapp', 'llamada', 'seccion', 'interna', 'externa');
  CREATE TYPE "public"."enum_inicio_blocks_carrusel_portadas_acciones_estilo" AS ENUM('principal', 'secundario');
  CREATE TYPE "public"."enum_inicio_blocks_carrusel_portadas_disposicion" AS ENUM('texto-izquierda', 'texto-derecha', 'imagen-completa');
  CREATE TYPE "public"."enum_inicio_blocks_carrusel_portadas_transicion" AS ENUM('fundido', 'izquierda', 'bajar', 'recorte');
  CREATE TYPE "public"."enum_navegacion_items_tipo" AS ENUM('seccion', 'interna', 'externa');
  CREATE TYPE "public"."enum_configuracion_del_sitio_redes_sociales_red" AS ENUM('facebook', 'x', 'youtube', 'instagram', 'tiktok', 'linkedin');
  CREATE TABLE "areas_de_servicio_puntos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"texto" varchar NOT NULL
  );
  
  CREATE TABLE "areas_de_servicio" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"codigo" varchar NOT NULL,
  	"nombre" varchar NOT NULL,
  	"nombre_corto" varchar NOT NULL,
  	"descripcion" varchar NOT NULL,
  	"mensaje_de_consulta" varchar,
  	"poligono_en_la_rueda" varchar,
  	"orden" numeric DEFAULT 0 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "planes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL,
  	"descripcion" varchar,
  	"destacado" boolean DEFAULT false,
  	"mensaje_de_consulta" varchar,
  	"orden" numeric DEFAULT 0 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "caracteristicas_de_plan" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL,
  	"orden" numeric DEFAULT 0 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "inclusiones_de_plan" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"plan_id" integer NOT NULL,
  	"caracteristica_id" integer NOT NULL,
  	"tipo" "enum_inclusiones_de_plan_tipo" DEFAULT 'incluido' NOT NULL,
  	"texto" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "valores" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL,
  	"icono" "enum_valores_icono" NOT NULL,
  	"orden" numeric DEFAULT 0 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "clientes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL,
  	"logo_id" integer NOT NULL,
  	"enlace" varchar,
  	"orden" numeric DEFAULT 0 NOT NULL,
  	"activo" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "avisos_para_clientes_documentos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"texto" varchar NOT NULL
  );
  
  CREATE TABLE "avisos_para_clientes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titulo" varchar NOT NULL,
  	"cuando_aplica" varchar NOT NULL,
  	"correo_de_contacto" varchar,
  	"orden" numeric DEFAULT 0 NOT NULL,
  	"activo" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "vencimientos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"obligacion" varchar NOT NULL,
  	"periodicidad" "enum_vencimientos_periodicidad" NOT NULL,
  	"cuando_vence" varchar NOT NULL,
  	"nota" varchar,
  	"orden" numeric DEFAULT 0 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cronogramas_sunat_fechas_por_digito" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"digito" numeric NOT NULL,
  	"fecha" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "cronogramas_sunat" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"anio" numeric NOT NULL,
  	"mes" numeric NOT NULL,
  	"periodo" varchar,
  	"fecha_buenos_contribuyentes" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "publicaciones" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titulo" varchar,
  	"slug" varchar,
  	"extracto" varchar,
  	"imagen_id" integer,
  	"contenido" jsonb,
  	"categoria_id" integer,
  	"fecha_de_publicacion" timestamp(3) with time zone,
  	"seo_titulo" varchar,
  	"seo_descripcion" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_publicaciones_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "publicaciones_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"etiquetas_id" integer
  );
  
  CREATE TABLE "_publicaciones_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_titulo" varchar,
  	"version_slug" varchar,
  	"version_extracto" varchar,
  	"version_imagen_id" integer,
  	"version_contenido" jsonb,
  	"version_categoria_id" integer,
  	"version_fecha_de_publicacion" timestamp(3) with time zone,
  	"version_seo_titulo" varchar,
  	"version_seo_descripcion" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__publicaciones_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_publicaciones_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"etiquetas_id" integer
  );
  
  CREATE TABLE "categorias" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "etiquetas" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"color" "enum_etiquetas_color" DEFAULT 'azul' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "mensajes_de_contacto" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL,
  	"celular" varchar,
  	"correo" varchar,
  	"servicio_de_interes" varchar,
  	"mensaje" varchar NOT NULL,
  	"estado" "enum_mensajes_de_contacto_estado" DEFAULT 'nuevo' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "sedes_celulares" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"numero" varchar NOT NULL,
  	"tiene_whats_app" boolean
  );
  
  CREATE TABLE "sedes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL,
  	"direccion" varchar NOT NULL,
  	"distrito" varchar NOT NULL,
  	"ciudad" varchar DEFAULT 'Lima' NOT NULL,
  	"correo" varchar,
  	"enlace_de_mapa" varchar,
  	"orden" numeric DEFAULT 0 NOT NULL,
  	"activo" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "medios" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "usuarios_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "usuarios" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre" varchar,
  	"rol" "enum_usuarios_rol" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"areas_de_servicio_id" integer,
  	"planes_id" integer,
  	"caracteristicas_de_plan_id" integer,
  	"inclusiones_de_plan_id" integer,
  	"valores_id" integer,
  	"clientes_id" integer,
  	"avisos_para_clientes_id" integer,
  	"vencimientos_id" integer,
  	"cronogramas_sunat_id" integer,
  	"publicaciones_id" integer,
  	"categorias_id" integer,
  	"etiquetas_id" integer,
  	"mensajes_de_contacto_id" integer,
  	"sedes_id" integer,
  	"medios_id" integer,
  	"usuarios_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"usuarios_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "inicio_blocks_carrusel_portadas_lista" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"texto" varchar NOT NULL
  );
  
  CREATE TABLE "inicio_blocks_carrusel_portadas_acciones" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"etiqueta" varchar NOT NULL,
  	"tipo" "enum_inicio_blocks_carrusel_portadas_acciones_tipo" DEFAULT 'whatsapp' NOT NULL,
  	"mensaje" varchar,
  	"destino" varchar,
  	"estilo" "enum_inicio_blocks_carrusel_portadas_acciones_estilo" DEFAULT 'principal' NOT NULL
  );
  
  CREATE TABLE "inicio_blocks_carrusel_portadas" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"imagen_id" integer NOT NULL,
  	"imagen_es_decorativa" boolean DEFAULT true,
  	"imagen_para_celular_id" integer,
  	"encuadre_en_celular" numeric,
  	"disposicion" "enum_inicio_blocks_carrusel_portadas_disposicion" DEFAULT 'texto-izquierda' NOT NULL,
  	"transicion" "enum_inicio_blocks_carrusel_portadas_transicion" DEFAULT 'fundido' NOT NULL,
  	"titulo" varchar,
  	"subtitulo" varchar,
  	"sello_id" integer
  );
  
  CREATE TABLE "inicio_blocks_carrusel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"segundos_por_portada" numeric DEFAULT 9 NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "inicio_blocks_quienes_somos_cifras" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"prefijo" varchar DEFAULT 'Más de',
  	"valor" numeric NOT NULL,
  	"sufijo" varchar,
  	"descripcion" varchar NOT NULL
  );
  
  CREATE TABLE "inicio_blocks_quienes_somos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"ancla" varchar DEFAULT 'quienes-somos',
  	"titulo" varchar NOT NULL,
  	"bajada" varchar,
  	"presentacion" jsonb NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "inicio_blocks_servicios" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"ancla" varchar DEFAULT 'servicios',
  	"titulo" varchar NOT NULL,
  	"bajada" varchar,
  	"imagen_de_la_rueda_id" integer NOT NULL,
  	"texto_del_boton" varchar DEFAULT 'Consultar este servicio' NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "inicio_blocks_planes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"ancla" varchar DEFAULT 'planes',
  	"titulo" varchar NOT NULL,
  	"bajada" varchar,
  	"encabezado_de_caracteristicas" varchar DEFAULT 'Qué incluye' NOT NULL,
  	"texto_del_boton" varchar DEFAULT 'Solicitar' NOT NULL,
  	"nota_al_pie" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "inicio_blocks_por_que_elegirnos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"ancla" varchar DEFAULT '',
  	"titulo" varchar NOT NULL,
  	"bajada" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "inicio_blocks_clientes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"ancla" varchar DEFAULT '',
  	"titulo" varchar NOT NULL,
  	"bajada" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "inicio_blocks_contacto_formulario_opciones_de_servicio" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"texto" varchar NOT NULL
  );
  
  CREATE TABLE "inicio_blocks_contacto" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"ancla" varchar DEFAULT 'contacto',
  	"titulo" varchar NOT NULL,
  	"bajada" varchar,
  	"formulario_titulo" varchar NOT NULL,
  	"formulario_texto" varchar,
  	"formulario_texto_del_boton" varchar NOT NULL,
  	"canales_whatsapp" varchar DEFAULT 'WhatsApp',
  	"canales_llamada" varchar DEFAULT 'Llámanos',
  	"canales_correo" varchar DEFAULT 'Correo',
  	"canales_boton_del_mapa" varchar DEFAULT 'Ver mapa',
  	"sede_del_mapa_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "inicio" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"seo_titulo" varchar,
  	"seo_descripcion" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "guia_de_clientes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titulo" varchar NOT NULL,
  	"introduccion" varchar,
  	"titulo_de_avisos" varchar NOT NULL,
  	"titulo_de_vencimientos" varchar NOT NULL,
  	"titulo_del_cronograma" varchar NOT NULL,
  	"seo_titulo" varchar,
  	"seo_descripcion" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "pagina_del_blog" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titulo" varchar NOT NULL,
  	"introduccion" varchar,
  	"texto_sin_publicaciones" varchar NOT NULL,
  	"seo_titulo" varchar,
  	"seo_descripcion" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "navegacion_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"etiqueta" varchar NOT NULL,
  	"tipo" "enum_navegacion_items_tipo" DEFAULT 'seccion' NOT NULL,
  	"destino" varchar,
  	"abrir_en_nueva_pestana" boolean DEFAULT false,
  	"imagen_id" integer
  );
  
  CREATE TABLE "navegacion" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "configuracion_del_sitio_redes_sociales" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"red" "enum_configuracion_del_sitio_redes_sociales_red" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "configuracion_del_sitio" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"marca_nombre_comercial" varchar NOT NULL,
  	"marca_razon_social" varchar NOT NULL,
  	"marca_grupo" varchar,
  	"marca_lema" varchar,
  	"marca_logo_id" integer NOT NULL,
  	"marca_sello_id" integer,
  	"contacto_correo" varchar NOT NULL,
  	"contacto_celular_whats_app" varchar NOT NULL,
  	"contacto_mensaje_whats_app" varchar NOT NULL,
  	"contacto_celular_de_llamadas" varchar NOT NULL,
  	"contacto_texto_del_boton_flotante" varchar DEFAULT 'Escríbenos' NOT NULL,
  	"seo_titulo" varchar NOT NULL,
  	"seo_descripcion" varchar NOT NULL,
  	"seo_imagen_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "areas_de_servicio_puntos" ADD CONSTRAINT "areas_de_servicio_puntos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."areas_de_servicio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inclusiones_de_plan" ADD CONSTRAINT "inclusiones_de_plan_plan_id_planes_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."planes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "inclusiones_de_plan" ADD CONSTRAINT "inclusiones_de_plan_caracteristica_id_caracteristic_8acb10f6_fk" FOREIGN KEY ("caracteristica_id") REFERENCES "public"."caracteristicas_de_plan"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "clientes" ADD CONSTRAINT "clientes_logo_id_medios_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."medios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "avisos_para_clientes_documentos" ADD CONSTRAINT "avisos_para_clientes_documentos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."avisos_para_clientes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cronogramas_sunat_fechas_por_digito" ADD CONSTRAINT "cronogramas_sunat_fechas_por_digito_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cronogramas_sunat"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "publicaciones" ADD CONSTRAINT "publicaciones_imagen_id_medios_id_fk" FOREIGN KEY ("imagen_id") REFERENCES "public"."medios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "publicaciones" ADD CONSTRAINT "publicaciones_categoria_id_categorias_id_fk" FOREIGN KEY ("categoria_id") REFERENCES "public"."categorias"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "publicaciones_rels" ADD CONSTRAINT "publicaciones_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."publicaciones"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "publicaciones_rels" ADD CONSTRAINT "publicaciones_rels_etiquetas_fk" FOREIGN KEY ("etiquetas_id") REFERENCES "public"."etiquetas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_publicaciones_v" ADD CONSTRAINT "_publicaciones_v_parent_id_publicaciones_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."publicaciones"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_publicaciones_v" ADD CONSTRAINT "_publicaciones_v_version_imagen_id_medios_id_fk" FOREIGN KEY ("version_imagen_id") REFERENCES "public"."medios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_publicaciones_v" ADD CONSTRAINT "_publicaciones_v_version_categoria_id_categorias_id_fk" FOREIGN KEY ("version_categoria_id") REFERENCES "public"."categorias"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_publicaciones_v_rels" ADD CONSTRAINT "_publicaciones_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_publicaciones_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_publicaciones_v_rels" ADD CONSTRAINT "_publicaciones_v_rels_etiquetas_fk" FOREIGN KEY ("etiquetas_id") REFERENCES "public"."etiquetas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sedes_celulares" ADD CONSTRAINT "sedes_celulares_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sedes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "usuarios_sessions" ADD CONSTRAINT "usuarios_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_areas_de_servicio_fk" FOREIGN KEY ("areas_de_servicio_id") REFERENCES "public"."areas_de_servicio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_planes_fk" FOREIGN KEY ("planes_id") REFERENCES "public"."planes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_caracteristicas_de_plan_fk" FOREIGN KEY ("caracteristicas_de_plan_id") REFERENCES "public"."caracteristicas_de_plan"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inclusiones_de_plan_fk" FOREIGN KEY ("inclusiones_de_plan_id") REFERENCES "public"."inclusiones_de_plan"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_valores_fk" FOREIGN KEY ("valores_id") REFERENCES "public"."valores"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_clientes_fk" FOREIGN KEY ("clientes_id") REFERENCES "public"."clientes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_avisos_para_clientes_fk" FOREIGN KEY ("avisos_para_clientes_id") REFERENCES "public"."avisos_para_clientes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_vencimientos_fk" FOREIGN KEY ("vencimientos_id") REFERENCES "public"."vencimientos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cronogramas_sunat_fk" FOREIGN KEY ("cronogramas_sunat_id") REFERENCES "public"."cronogramas_sunat"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_publicaciones_fk" FOREIGN KEY ("publicaciones_id") REFERENCES "public"."publicaciones"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categorias_fk" FOREIGN KEY ("categorias_id") REFERENCES "public"."categorias"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_etiquetas_fk" FOREIGN KEY ("etiquetas_id") REFERENCES "public"."etiquetas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_mensajes_de_contacto_fk" FOREIGN KEY ("mensajes_de_contacto_id") REFERENCES "public"."mensajes_de_contacto"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sedes_fk" FOREIGN KEY ("sedes_id") REFERENCES "public"."sedes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_medios_fk" FOREIGN KEY ("medios_id") REFERENCES "public"."medios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_usuarios_fk" FOREIGN KEY ("usuarios_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_usuarios_fk" FOREIGN KEY ("usuarios_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inicio_blocks_carrusel_portadas_lista" ADD CONSTRAINT "inicio_blocks_carrusel_portadas_lista_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."inicio_blocks_carrusel_portadas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inicio_blocks_carrusel_portadas_acciones" ADD CONSTRAINT "inicio_blocks_carrusel_portadas_acciones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."inicio_blocks_carrusel_portadas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inicio_blocks_carrusel_portadas" ADD CONSTRAINT "inicio_blocks_carrusel_portadas_imagen_id_medios_id_fk" FOREIGN KEY ("imagen_id") REFERENCES "public"."medios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "inicio_blocks_carrusel_portadas" ADD CONSTRAINT "inicio_blocks_carrusel_portadas_sello_id_medios_id_fk" FOREIGN KEY ("sello_id") REFERENCES "public"."medios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "inicio_blocks_carrusel_portadas" ADD CONSTRAINT "inicio_blocks_carrusel_portadas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."inicio_blocks_carrusel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inicio_blocks_carrusel_portadas" ADD CONSTRAINT "inicio_blocks_carrusel_portadas_imagen_para_celular_dad478ac_fk" FOREIGN KEY ("imagen_para_celular_id") REFERENCES "public"."medios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "inicio_blocks_carrusel" ADD CONSTRAINT "inicio_blocks_carrusel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."inicio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inicio_blocks_quienes_somos_cifras" ADD CONSTRAINT "inicio_blocks_quienes_somos_cifras_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."inicio_blocks_quienes_somos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inicio_blocks_quienes_somos" ADD CONSTRAINT "inicio_blocks_quienes_somos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."inicio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inicio_blocks_servicios" ADD CONSTRAINT "inicio_blocks_servicios_imagen_de_la_rueda_id_medios_id_fk" FOREIGN KEY ("imagen_de_la_rueda_id") REFERENCES "public"."medios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "inicio_blocks_servicios" ADD CONSTRAINT "inicio_blocks_servicios_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."inicio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inicio_blocks_planes" ADD CONSTRAINT "inicio_blocks_planes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."inicio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inicio_blocks_por_que_elegirnos" ADD CONSTRAINT "inicio_blocks_por_que_elegirnos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."inicio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inicio_blocks_clientes" ADD CONSTRAINT "inicio_blocks_clientes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."inicio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inicio_blocks_contacto_formulario_opciones_de_servicio" ADD CONSTRAINT "inicio_blocks_contacto_formulario_opciones_de_servi_2e38a11f_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."inicio_blocks_contacto"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inicio_blocks_contacto" ADD CONSTRAINT "inicio_blocks_contacto_sede_del_mapa_id_sedes_id_fk" FOREIGN KEY ("sede_del_mapa_id") REFERENCES "public"."sedes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "inicio_blocks_contacto" ADD CONSTRAINT "inicio_blocks_contacto_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."inicio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navegacion_items" ADD CONSTRAINT "navegacion_items_imagen_id_medios_id_fk" FOREIGN KEY ("imagen_id") REFERENCES "public"."medios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navegacion_items" ADD CONSTRAINT "navegacion_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navegacion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "configuracion_del_sitio_redes_sociales" ADD CONSTRAINT "configuracion_del_sitio_redes_sociales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."configuracion_del_sitio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "configuracion_del_sitio" ADD CONSTRAINT "configuracion_del_sitio_marca_logo_id_medios_id_fk" FOREIGN KEY ("marca_logo_id") REFERENCES "public"."medios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "configuracion_del_sitio" ADD CONSTRAINT "configuracion_del_sitio_marca_sello_id_medios_id_fk" FOREIGN KEY ("marca_sello_id") REFERENCES "public"."medios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "configuracion_del_sitio" ADD CONSTRAINT "configuracion_del_sitio_seo_imagen_id_medios_id_fk" FOREIGN KEY ("seo_imagen_id") REFERENCES "public"."medios"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "areas_de_servicio_puntos_order_idx" ON "areas_de_servicio_puntos" USING btree ("_order");
  CREATE INDEX "areas_de_servicio_puntos_parent_id_idx" ON "areas_de_servicio_puntos" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "areas_de_servicio_codigo_idx" ON "areas_de_servicio" USING btree ("codigo");
  CREATE INDEX "areas_de_servicio_orden_idx" ON "areas_de_servicio" USING btree ("orden");
  CREATE INDEX "areas_de_servicio_updated_at_idx" ON "areas_de_servicio" USING btree ("updated_at");
  CREATE INDEX "areas_de_servicio_created_at_idx" ON "areas_de_servicio" USING btree ("created_at");
  CREATE UNIQUE INDEX "planes_nombre_idx" ON "planes" USING btree ("nombre");
  CREATE INDEX "planes_orden_idx" ON "planes" USING btree ("orden");
  CREATE INDEX "planes_updated_at_idx" ON "planes" USING btree ("updated_at");
  CREATE INDEX "planes_created_at_idx" ON "planes" USING btree ("created_at");
  CREATE UNIQUE INDEX "caracteristicas_de_plan_nombre_idx" ON "caracteristicas_de_plan" USING btree ("nombre");
  CREATE INDEX "caracteristicas_de_plan_orden_idx" ON "caracteristicas_de_plan" USING btree ("orden");
  CREATE INDEX "caracteristicas_de_plan_updated_at_idx" ON "caracteristicas_de_plan" USING btree ("updated_at");
  CREATE INDEX "caracteristicas_de_plan_created_at_idx" ON "caracteristicas_de_plan" USING btree ("created_at");
  CREATE INDEX "inclusiones_de_plan_plan_idx" ON "inclusiones_de_plan" USING btree ("plan_id");
  CREATE INDEX "inclusiones_de_plan_caracteristica_idx" ON "inclusiones_de_plan" USING btree ("caracteristica_id");
  CREATE INDEX "inclusiones_de_plan_updated_at_idx" ON "inclusiones_de_plan" USING btree ("updated_at");
  CREATE INDEX "inclusiones_de_plan_created_at_idx" ON "inclusiones_de_plan" USING btree ("created_at");
  CREATE UNIQUE INDEX "plan_caracteristica_idx" ON "inclusiones_de_plan" USING btree ("plan_id","caracteristica_id");
  CREATE INDEX "valores_orden_idx" ON "valores" USING btree ("orden");
  CREATE INDEX "valores_updated_at_idx" ON "valores" USING btree ("updated_at");
  CREATE INDEX "valores_created_at_idx" ON "valores" USING btree ("created_at");
  CREATE INDEX "clientes_logo_idx" ON "clientes" USING btree ("logo_id");
  CREATE INDEX "clientes_orden_idx" ON "clientes" USING btree ("orden");
  CREATE INDEX "clientes_updated_at_idx" ON "clientes" USING btree ("updated_at");
  CREATE INDEX "clientes_created_at_idx" ON "clientes" USING btree ("created_at");
  CREATE INDEX "avisos_para_clientes_documentos_order_idx" ON "avisos_para_clientes_documentos" USING btree ("_order");
  CREATE INDEX "avisos_para_clientes_documentos_parent_id_idx" ON "avisos_para_clientes_documentos" USING btree ("_parent_id");
  CREATE INDEX "avisos_para_clientes_orden_idx" ON "avisos_para_clientes" USING btree ("orden");
  CREATE INDEX "avisos_para_clientes_updated_at_idx" ON "avisos_para_clientes" USING btree ("updated_at");
  CREATE INDEX "avisos_para_clientes_created_at_idx" ON "avisos_para_clientes" USING btree ("created_at");
  CREATE INDEX "vencimientos_orden_idx" ON "vencimientos" USING btree ("orden");
  CREATE INDEX "vencimientos_updated_at_idx" ON "vencimientos" USING btree ("updated_at");
  CREATE INDEX "vencimientos_created_at_idx" ON "vencimientos" USING btree ("created_at");
  CREATE INDEX "cronogramas_sunat_fechas_por_digito_order_idx" ON "cronogramas_sunat_fechas_por_digito" USING btree ("_order");
  CREATE INDEX "cronogramas_sunat_fechas_por_digito_parent_id_idx" ON "cronogramas_sunat_fechas_por_digito" USING btree ("_parent_id");
  CREATE INDEX "cronogramas_sunat_updated_at_idx" ON "cronogramas_sunat" USING btree ("updated_at");
  CREATE INDEX "cronogramas_sunat_created_at_idx" ON "cronogramas_sunat" USING btree ("created_at");
  CREATE UNIQUE INDEX "anio_mes_idx" ON "cronogramas_sunat" USING btree ("anio","mes");
  CREATE UNIQUE INDEX "publicaciones_slug_idx" ON "publicaciones" USING btree ("slug");
  CREATE INDEX "publicaciones_imagen_idx" ON "publicaciones" USING btree ("imagen_id");
  CREATE INDEX "publicaciones_categoria_idx" ON "publicaciones" USING btree ("categoria_id");
  CREATE INDEX "publicaciones_fecha_de_publicacion_idx" ON "publicaciones" USING btree ("fecha_de_publicacion");
  CREATE INDEX "publicaciones_updated_at_idx" ON "publicaciones" USING btree ("updated_at");
  CREATE INDEX "publicaciones_created_at_idx" ON "publicaciones" USING btree ("created_at");
  CREATE INDEX "publicaciones__status_idx" ON "publicaciones" USING btree ("_status");
  CREATE INDEX "publicaciones_rels_order_idx" ON "publicaciones_rels" USING btree ("order");
  CREATE INDEX "publicaciones_rels_parent_idx" ON "publicaciones_rels" USING btree ("parent_id");
  CREATE INDEX "publicaciones_rels_path_idx" ON "publicaciones_rels" USING btree ("path");
  CREATE INDEX "publicaciones_rels_etiquetas_id_idx" ON "publicaciones_rels" USING btree ("etiquetas_id");
  CREATE INDEX "_publicaciones_v_parent_idx" ON "_publicaciones_v" USING btree ("parent_id");
  CREATE INDEX "_publicaciones_v_version_version_slug_idx" ON "_publicaciones_v" USING btree ("version_slug");
  CREATE INDEX "_publicaciones_v_version_version_imagen_idx" ON "_publicaciones_v" USING btree ("version_imagen_id");
  CREATE INDEX "_publicaciones_v_version_version_categoria_idx" ON "_publicaciones_v" USING btree ("version_categoria_id");
  CREATE INDEX "_publicaciones_v_version_version_fecha_de_publicacion_idx" ON "_publicaciones_v" USING btree ("version_fecha_de_publicacion");
  CREATE INDEX "_publicaciones_v_version_version_updated_at_idx" ON "_publicaciones_v" USING btree ("version_updated_at");
  CREATE INDEX "_publicaciones_v_version_version_created_at_idx" ON "_publicaciones_v" USING btree ("version_created_at");
  CREATE INDEX "_publicaciones_v_version_version__status_idx" ON "_publicaciones_v" USING btree ("version__status");
  CREATE INDEX "_publicaciones_v_created_at_idx" ON "_publicaciones_v" USING btree ("created_at");
  CREATE INDEX "_publicaciones_v_updated_at_idx" ON "_publicaciones_v" USING btree ("updated_at");
  CREATE INDEX "_publicaciones_v_latest_idx" ON "_publicaciones_v" USING btree ("latest");
  CREATE INDEX "_publicaciones_v_rels_order_idx" ON "_publicaciones_v_rels" USING btree ("order");
  CREATE INDEX "_publicaciones_v_rels_parent_idx" ON "_publicaciones_v_rels" USING btree ("parent_id");
  CREATE INDEX "_publicaciones_v_rels_path_idx" ON "_publicaciones_v_rels" USING btree ("path");
  CREATE INDEX "_publicaciones_v_rels_etiquetas_id_idx" ON "_publicaciones_v_rels" USING btree ("etiquetas_id");
  CREATE UNIQUE INDEX "categorias_nombre_idx" ON "categorias" USING btree ("nombre");
  CREATE UNIQUE INDEX "categorias_slug_idx" ON "categorias" USING btree ("slug");
  CREATE INDEX "categorias_updated_at_idx" ON "categorias" USING btree ("updated_at");
  CREATE INDEX "categorias_created_at_idx" ON "categorias" USING btree ("created_at");
  CREATE UNIQUE INDEX "etiquetas_nombre_idx" ON "etiquetas" USING btree ("nombre");
  CREATE UNIQUE INDEX "etiquetas_slug_idx" ON "etiquetas" USING btree ("slug");
  CREATE INDEX "etiquetas_updated_at_idx" ON "etiquetas" USING btree ("updated_at");
  CREATE INDEX "etiquetas_created_at_idx" ON "etiquetas" USING btree ("created_at");
  CREATE INDEX "mensajes_de_contacto_estado_idx" ON "mensajes_de_contacto" USING btree ("estado");
  CREATE INDEX "mensajes_de_contacto_updated_at_idx" ON "mensajes_de_contacto" USING btree ("updated_at");
  CREATE INDEX "mensajes_de_contacto_created_at_idx" ON "mensajes_de_contacto" USING btree ("created_at");
  CREATE INDEX "sedes_celulares_order_idx" ON "sedes_celulares" USING btree ("_order");
  CREATE INDEX "sedes_celulares_parent_id_idx" ON "sedes_celulares" USING btree ("_parent_id");
  CREATE INDEX "sedes_orden_idx" ON "sedes" USING btree ("orden");
  CREATE INDEX "sedes_updated_at_idx" ON "sedes" USING btree ("updated_at");
  CREATE INDEX "sedes_created_at_idx" ON "sedes" USING btree ("created_at");
  CREATE INDEX "medios_updated_at_idx" ON "medios" USING btree ("updated_at");
  CREATE INDEX "medios_created_at_idx" ON "medios" USING btree ("created_at");
  CREATE UNIQUE INDEX "medios_filename_idx" ON "medios" USING btree ("filename");
  CREATE INDEX "usuarios_sessions_order_idx" ON "usuarios_sessions" USING btree ("_order");
  CREATE INDEX "usuarios_sessions_parent_id_idx" ON "usuarios_sessions" USING btree ("_parent_id");
  CREATE INDEX "usuarios_updated_at_idx" ON "usuarios" USING btree ("updated_at");
  CREATE INDEX "usuarios_created_at_idx" ON "usuarios" USING btree ("created_at");
  CREATE UNIQUE INDEX "usuarios_email_idx" ON "usuarios" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_areas_de_servicio_id_idx" ON "payload_locked_documents_rels" USING btree ("areas_de_servicio_id");
  CREATE INDEX "payload_locked_documents_rels_planes_id_idx" ON "payload_locked_documents_rels" USING btree ("planes_id");
  CREATE INDEX "payload_locked_documents_rels_caracteristicas_de_plan_id_idx" ON "payload_locked_documents_rels" USING btree ("caracteristicas_de_plan_id");
  CREATE INDEX "payload_locked_documents_rels_inclusiones_de_plan_id_idx" ON "payload_locked_documents_rels" USING btree ("inclusiones_de_plan_id");
  CREATE INDEX "payload_locked_documents_rels_valores_id_idx" ON "payload_locked_documents_rels" USING btree ("valores_id");
  CREATE INDEX "payload_locked_documents_rels_clientes_id_idx" ON "payload_locked_documents_rels" USING btree ("clientes_id");
  CREATE INDEX "payload_locked_documents_rels_avisos_para_clientes_id_idx" ON "payload_locked_documents_rels" USING btree ("avisos_para_clientes_id");
  CREATE INDEX "payload_locked_documents_rels_vencimientos_id_idx" ON "payload_locked_documents_rels" USING btree ("vencimientos_id");
  CREATE INDEX "payload_locked_documents_rels_cronogramas_sunat_id_idx" ON "payload_locked_documents_rels" USING btree ("cronogramas_sunat_id");
  CREATE INDEX "payload_locked_documents_rels_publicaciones_id_idx" ON "payload_locked_documents_rels" USING btree ("publicaciones_id");
  CREATE INDEX "payload_locked_documents_rels_categorias_id_idx" ON "payload_locked_documents_rels" USING btree ("categorias_id");
  CREATE INDEX "payload_locked_documents_rels_etiquetas_id_idx" ON "payload_locked_documents_rels" USING btree ("etiquetas_id");
  CREATE INDEX "payload_locked_documents_rels_mensajes_de_contacto_id_idx" ON "payload_locked_documents_rels" USING btree ("mensajes_de_contacto_id");
  CREATE INDEX "payload_locked_documents_rels_sedes_id_idx" ON "payload_locked_documents_rels" USING btree ("sedes_id");
  CREATE INDEX "payload_locked_documents_rels_medios_id_idx" ON "payload_locked_documents_rels" USING btree ("medios_id");
  CREATE INDEX "payload_locked_documents_rels_usuarios_id_idx" ON "payload_locked_documents_rels" USING btree ("usuarios_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_usuarios_id_idx" ON "payload_preferences_rels" USING btree ("usuarios_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "inicio_blocks_carrusel_portadas_lista_order_idx" ON "inicio_blocks_carrusel_portadas_lista" USING btree ("_order");
  CREATE INDEX "inicio_blocks_carrusel_portadas_lista_parent_id_idx" ON "inicio_blocks_carrusel_portadas_lista" USING btree ("_parent_id");
  CREATE INDEX "inicio_blocks_carrusel_portadas_acciones_order_idx" ON "inicio_blocks_carrusel_portadas_acciones" USING btree ("_order");
  CREATE INDEX "inicio_blocks_carrusel_portadas_acciones_parent_id_idx" ON "inicio_blocks_carrusel_portadas_acciones" USING btree ("_parent_id");
  CREATE INDEX "inicio_blocks_carrusel_portadas_order_idx" ON "inicio_blocks_carrusel_portadas" USING btree ("_order");
  CREATE INDEX "inicio_blocks_carrusel_portadas_parent_id_idx" ON "inicio_blocks_carrusel_portadas" USING btree ("_parent_id");
  CREATE INDEX "inicio_blocks_carrusel_portadas_imagen_idx" ON "inicio_blocks_carrusel_portadas" USING btree ("imagen_id");
  CREATE INDEX "inicio_blocks_carrusel_portadas_imagen_para_celular_idx" ON "inicio_blocks_carrusel_portadas" USING btree ("imagen_para_celular_id");
  CREATE INDEX "inicio_blocks_carrusel_portadas_sello_idx" ON "inicio_blocks_carrusel_portadas" USING btree ("sello_id");
  CREATE INDEX "inicio_blocks_carrusel_order_idx" ON "inicio_blocks_carrusel" USING btree ("_order");
  CREATE INDEX "inicio_blocks_carrusel_parent_id_idx" ON "inicio_blocks_carrusel" USING btree ("_parent_id");
  CREATE INDEX "inicio_blocks_carrusel_path_idx" ON "inicio_blocks_carrusel" USING btree ("_path");
  CREATE INDEX "inicio_blocks_quienes_somos_cifras_order_idx" ON "inicio_blocks_quienes_somos_cifras" USING btree ("_order");
  CREATE INDEX "inicio_blocks_quienes_somos_cifras_parent_id_idx" ON "inicio_blocks_quienes_somos_cifras" USING btree ("_parent_id");
  CREATE INDEX "inicio_blocks_quienes_somos_order_idx" ON "inicio_blocks_quienes_somos" USING btree ("_order");
  CREATE INDEX "inicio_blocks_quienes_somos_parent_id_idx" ON "inicio_blocks_quienes_somos" USING btree ("_parent_id");
  CREATE INDEX "inicio_blocks_quienes_somos_path_idx" ON "inicio_blocks_quienes_somos" USING btree ("_path");
  CREATE INDEX "inicio_blocks_servicios_order_idx" ON "inicio_blocks_servicios" USING btree ("_order");
  CREATE INDEX "inicio_blocks_servicios_parent_id_idx" ON "inicio_blocks_servicios" USING btree ("_parent_id");
  CREATE INDEX "inicio_blocks_servicios_path_idx" ON "inicio_blocks_servicios" USING btree ("_path");
  CREATE INDEX "inicio_blocks_servicios_imagen_de_la_rueda_idx" ON "inicio_blocks_servicios" USING btree ("imagen_de_la_rueda_id");
  CREATE INDEX "inicio_blocks_planes_order_idx" ON "inicio_blocks_planes" USING btree ("_order");
  CREATE INDEX "inicio_blocks_planes_parent_id_idx" ON "inicio_blocks_planes" USING btree ("_parent_id");
  CREATE INDEX "inicio_blocks_planes_path_idx" ON "inicio_blocks_planes" USING btree ("_path");
  CREATE INDEX "inicio_blocks_por_que_elegirnos_order_idx" ON "inicio_blocks_por_que_elegirnos" USING btree ("_order");
  CREATE INDEX "inicio_blocks_por_que_elegirnos_parent_id_idx" ON "inicio_blocks_por_que_elegirnos" USING btree ("_parent_id");
  CREATE INDEX "inicio_blocks_por_que_elegirnos_path_idx" ON "inicio_blocks_por_que_elegirnos" USING btree ("_path");
  CREATE INDEX "inicio_blocks_clientes_order_idx" ON "inicio_blocks_clientes" USING btree ("_order");
  CREATE INDEX "inicio_blocks_clientes_parent_id_idx" ON "inicio_blocks_clientes" USING btree ("_parent_id");
  CREATE INDEX "inicio_blocks_clientes_path_idx" ON "inicio_blocks_clientes" USING btree ("_path");
  CREATE INDEX "inicio_blocks_contacto_formulario_opciones_de_serv_9b9bdbb7_idx" ON "inicio_blocks_contacto_formulario_opciones_de_servicio" USING btree ("_order");
  CREATE INDEX "inicio_blocks_contacto_formulario_opciones_de_serv_fd1212eb_idx" ON "inicio_blocks_contacto_formulario_opciones_de_servicio" USING btree ("_parent_id");
  CREATE INDEX "inicio_blocks_contacto_order_idx" ON "inicio_blocks_contacto" USING btree ("_order");
  CREATE INDEX "inicio_blocks_contacto_parent_id_idx" ON "inicio_blocks_contacto" USING btree ("_parent_id");
  CREATE INDEX "inicio_blocks_contacto_path_idx" ON "inicio_blocks_contacto" USING btree ("_path");
  CREATE INDEX "inicio_blocks_contacto_sede_del_mapa_idx" ON "inicio_blocks_contacto" USING btree ("sede_del_mapa_id");
  CREATE INDEX "navegacion_items_order_idx" ON "navegacion_items" USING btree ("_order");
  CREATE INDEX "navegacion_items_parent_id_idx" ON "navegacion_items" USING btree ("_parent_id");
  CREATE INDEX "navegacion_items_imagen_idx" ON "navegacion_items" USING btree ("imagen_id");
  CREATE INDEX "configuracion_del_sitio_redes_sociales_order_idx" ON "configuracion_del_sitio_redes_sociales" USING btree ("_order");
  CREATE INDEX "configuracion_del_sitio_redes_sociales_parent_id_idx" ON "configuracion_del_sitio_redes_sociales" USING btree ("_parent_id");
  CREATE INDEX "configuracion_del_sitio_marca_marca_logo_idx" ON "configuracion_del_sitio" USING btree ("marca_logo_id");
  CREATE INDEX "configuracion_del_sitio_marca_marca_sello_idx" ON "configuracion_del_sitio" USING btree ("marca_sello_id");
  CREATE INDEX "configuracion_del_sitio_seo_seo_imagen_idx" ON "configuracion_del_sitio" USING btree ("seo_imagen_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "areas_de_servicio_puntos" CASCADE;
  DROP TABLE "areas_de_servicio" CASCADE;
  DROP TABLE "planes" CASCADE;
  DROP TABLE "caracteristicas_de_plan" CASCADE;
  DROP TABLE "inclusiones_de_plan" CASCADE;
  DROP TABLE "valores" CASCADE;
  DROP TABLE "clientes" CASCADE;
  DROP TABLE "avisos_para_clientes_documentos" CASCADE;
  DROP TABLE "avisos_para_clientes" CASCADE;
  DROP TABLE "vencimientos" CASCADE;
  DROP TABLE "cronogramas_sunat_fechas_por_digito" CASCADE;
  DROP TABLE "cronogramas_sunat" CASCADE;
  DROP TABLE "publicaciones" CASCADE;
  DROP TABLE "publicaciones_rels" CASCADE;
  DROP TABLE "_publicaciones_v" CASCADE;
  DROP TABLE "_publicaciones_v_rels" CASCADE;
  DROP TABLE "categorias" CASCADE;
  DROP TABLE "etiquetas" CASCADE;
  DROP TABLE "mensajes_de_contacto" CASCADE;
  DROP TABLE "sedes_celulares" CASCADE;
  DROP TABLE "sedes" CASCADE;
  DROP TABLE "medios" CASCADE;
  DROP TABLE "usuarios_sessions" CASCADE;
  DROP TABLE "usuarios" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "inicio_blocks_carrusel_portadas_lista" CASCADE;
  DROP TABLE "inicio_blocks_carrusel_portadas_acciones" CASCADE;
  DROP TABLE "inicio_blocks_carrusel_portadas" CASCADE;
  DROP TABLE "inicio_blocks_carrusel" CASCADE;
  DROP TABLE "inicio_blocks_quienes_somos_cifras" CASCADE;
  DROP TABLE "inicio_blocks_quienes_somos" CASCADE;
  DROP TABLE "inicio_blocks_servicios" CASCADE;
  DROP TABLE "inicio_blocks_planes" CASCADE;
  DROP TABLE "inicio_blocks_por_que_elegirnos" CASCADE;
  DROP TABLE "inicio_blocks_clientes" CASCADE;
  DROP TABLE "inicio_blocks_contacto_formulario_opciones_de_servicio" CASCADE;
  DROP TABLE "inicio_blocks_contacto" CASCADE;
  DROP TABLE "inicio" CASCADE;
  DROP TABLE "guia_de_clientes" CASCADE;
  DROP TABLE "pagina_del_blog" CASCADE;
  DROP TABLE "navegacion_items" CASCADE;
  DROP TABLE "navegacion" CASCADE;
  DROP TABLE "configuracion_del_sitio_redes_sociales" CASCADE;
  DROP TABLE "configuracion_del_sitio" CASCADE;
  DROP TYPE "public"."enum_inclusiones_de_plan_tipo";
  DROP TYPE "public"."enum_valores_icono";
  DROP TYPE "public"."enum_vencimientos_periodicidad";
  DROP TYPE "public"."enum_publicaciones_status";
  DROP TYPE "public"."enum__publicaciones_v_version_status";
  DROP TYPE "public"."enum_etiquetas_color";
  DROP TYPE "public"."enum_mensajes_de_contacto_estado";
  DROP TYPE "public"."enum_usuarios_rol";
  DROP TYPE "public"."enum_inicio_blocks_carrusel_portadas_acciones_tipo";
  DROP TYPE "public"."enum_inicio_blocks_carrusel_portadas_acciones_estilo";
  DROP TYPE "public"."enum_inicio_blocks_carrusel_portadas_disposicion";
  DROP TYPE "public"."enum_inicio_blocks_carrusel_portadas_transicion";
  DROP TYPE "public"."enum_navegacion_items_tipo";
  DROP TYPE "public"."enum_configuracion_del_sitio_redes_sociales_red";`)
}
