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

 Date: 05/07/2021 09:09:33
*/


-- ----------------------------
-- Table structure for map_files
-- ----------------------------
CREATE SEQUENCE IF NOT EXISTS public.map_files_id_seq;

CREATE TABLE IF NOT EXISTS "public"."map_files" (
  "id" int4 NOT NULL DEFAULT nextval('map_files_id_seq'::regclass),
  "original_name" varchar(255) COLLATE "pg_catalog"."default",
  "tmp_name" varchar(255) COLLATE "pg_catalog"."default",
  "cloud_id" varchar(600) COLLATE "pg_catalog"."default",
  "cloud_url" varchar(600) COLLATE "pg_catalog"."default",
  "map_id" int4 NOT NULL,
  "md5" varchar(255) COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Primary Key structure for table map_files
-- ----------------------------
ALTER TABLE "public"."map_files" ADD CONSTRAINT "map_files_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Keys structure for table map_files
-- ----------------------------
ALTER TABLE "public"."map_files" ADD CONSTRAINT "map_id_key" FOREIGN KEY ("map_id") REFERENCES "public"."maps" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
