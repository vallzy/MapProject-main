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
-- Table structure for map_votes
-- ----------------------------
CREATE SEQUENCE IF NOT EXISTS public.map_votes_seq;

CREATE TABLE IF NOT EXISTS "public"."map_votes" (
  "id" int4 NOT NULL DEFAULT nextval('map_votes_seq'::regclass),
  "map_id" int4 NOT NULL,
  "voter_ip_hash" varchar(255) COLLATE "pg_catalog"."default",
  "rating" real,
  "voted_on" timestamp NOT NULL
)
;

-- ----------------------------
-- Primary Key structure for table map_files
-- ----------------------------
ALTER TABLE "public"."map_votes" ADD CONSTRAINT "map_votes_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Keys structure for table map_files
-- ----------------------------
ALTER TABLE "public"."map_votes" ADD CONSTRAINT "map_id_key" FOREIGN KEY ("map_id") REFERENCES "public"."maps" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
