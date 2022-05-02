# Enemy Territory Public Map database project

## Goals

The goal of this project is to create a publicly available Enemy Territory Map database that offers more information and functionality over existing solutions. The information available on the database is curated by administrators and moderators on the website.

## Tech stack

- backend
  - express
  - postgresql
  - apache2
- frontend
  - vuejs 2.x.x
  - vuetify

## Running

`npm run dev` in root folder will start backend REST server and frontend dev server

### Backend development

run with:
`npm run start`

### Frontend development

Check _README_ in client folder.

# EXTENSIONS

Check workspace file for recommended extensions to use with this project.
Esbenp prettier and ESLint are the main ones.

# MIGRATION NOTES

past 01-07-2021

drop the table as it has now changed id to use a sequence, grand sequence rights to mapstat user:

```sql
DROP TABLE IF EXISTS "public"."maps";
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO mapstat;
```

# AWS

Scripts for fiddling with cloud can be found in server/aws folder.
