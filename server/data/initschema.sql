/*
 Navicat PostgreSQL Data Transfer

 Source Server         : Local
 Source Server Type    : PostgreSQL
 Source Server Version : 120007
 Source Host           : localhost:5432
 Source Catalog        : postgres
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 120007
 File Encoding         : 65001

 Date: 30/06/2021 06:46:49
*/


-- ----------------------------
-- Table structure for maps
-- ----------------------------
CREATE TABLE IF NOT EXISTS "public"."maps" (
  "id" int4 NOT NULL DEFAULT nextval('map_sequence'::regclass),
  "pkname" varchar(255) COLLATE "pg_catalog"."default",
  "author" varchar(255) COLLATE "pg_catalog"."default",
  "description" text COLLATE "pg_catalog"."default",
  "version" varchar(255) COLLATE "pg_catalog"."default",
  "size" int8,
  "releasedate" varchar(255) COLLATE "pg_catalog"."default",
  "map_name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "map_longname" varchar(255) COLLATE "pg_catalog"."default",
  "map_type" varchar(255) COLLATE "pg_catalog"."default",
  "map_briefing" text COLLATE "pg_catalog"."default",
  "map_timelimit" int8,
  "map_pos_x" int4,
  "map_pos_y" int4,
  "map_features" text[] COLLATE "pg_catalog"."default",
  "worldspawns" text[] COLLATE "pg_catalog"."default",
  "styles" text[] COLLATE "pg_catalog"."default",
  "mechanical_low" real,
  "mechanical_high" real,
  "strafe_low" real,
  "strafe_high" real,
  "map_txt" text COLLATE "pg_catalog"."default",
  "map_levelshot" boolean NOT NULL DEFAULT false,
  "metadata" json,
  "filetree" json,
  "status" varchar(10) COLLATE "pg_catalog"."default",
  "uploaded_at" timestamptz NOT NULL DEFAULT NOW()
);

COMMENT ON COLUMN "public"."maps"."pkname" IS 'name of pk3 file';
COMMENT ON COLUMN "public"."maps"."size" IS 'size of pk3';
COMMENT ON COLUMN "public"."maps"."map_name" IS 'map_name from arena file';

-- ----------------------------
-- Uniques structure for table maps
-- ----------------------------
ALTER TABLE "public"."maps" ADD CONSTRAINT "unique_mapname" UNIQUE ("map_name");
COMMENT ON CONSTRAINT "unique_mapname" ON "public"."maps" IS 'map name should be unique';

-- ----------------------------
-- Primary Key structure for table maps
-- ----------------------------
ALTER TABLE "public"."maps" ADD CONSTRAINT "mapdb_pkey" PRIMARY KEY ("id");
