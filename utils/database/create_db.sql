-- Database user
CREATE ROLE mcm
    LOGIN ENCRYPTED PASSWORD 'md5e2cb82178fe76945f9eaefe00e9f7edc'
    VALID UNTIL 'infinity';

-- Database creation
CREATE DATABASE mcm
    WITH ENCODING='UTF8'
    OWNER=mcm
    CONNECTION LIMIT=-1;

\connect mcm

-- Enable PostGIS (2.x)
create extension postgis;

-- Schema creation
CREATE SCHEMA data;
ALTER DATABASE mcm SET search_path=data,public;

\connect mcm

-- Table User
CREATE TABLE "user" (
    username text NOT NULL PRIMARY KEY,
    password text NOT NULL
);

-- Insert Test user
-- INSERT INTO "user" (username, password)
-- VALUES ('test', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08');

-- Table Culture
CREATE TABLE culture (
    id text NOT NULL PRIMARY KEY,
    continent text NOT NULL
);
SELECT AddGeometryColumn('culture', 'geometry', 4326, 'GEOMETRY', 2);
CREATE INDEX culture_geometry_gist ON culture USING GIST (geometry);

-- INSERT INTO culture(id, geometry) VALUES (42228, ST_GeomFromText(
--     'POLYGON((0 0,4 0,4 4,0 4,0 0),(1 1, 2 1, 2 2, 1 2,1 1))', 4326));

-- Table Object
CREATE TABLE object (
    id text NOT NULL PRIMARY KEY,
    culture text NOT NULL
);
SELECT AddGeometryColumn('object', 'geometry', 4326, 'GEOMETRY', 2);
CREATE INDEX object_geometry_gist ON object USING GIST (geometry);

-- Description Tables
CREATE TABLE description_ca (
    id text NOT NULL PRIMARY KEY,
    html text
);

CREATE TABLE description_es (
    id text NOT NULL PRIMARY KEY,
    html text
);

CREATE TABLE description_en (
    id text NOT NULL PRIMARY KEY,
    html text
);

-- Role privileges
GRANT USAGE ON SCHEMA data TO mcm;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO mcm;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA data TO mcm;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO mcm;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA data TO mcm;

-- Needed after restoring "data" schema:
-- SELECT Populate_Geometry_Columns();
