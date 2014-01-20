-- Database user
CREATE ROLE mcm
    LOGIN ENCRYPTED PASSWORD 'md5e2cb82178fe76945f9eaefe00e9f7edc'
    VALID UNTIL 'infinity';

-- Database creation
CREATE DATABASE mcm
    WITH ENCODING='UTF8'
    OWNER=mcm
    TEMPLATE=template_postgis
    CONNECTION LIMIT=-1;

\connect mcm

-- Schema creation
CREATE SCHEMA data;
ALTER DATABASE mcm SET search_path=data,public;

\connect mcm

-- Table User
CREATE TABLE "user" (
    username text NOT NULL PRIMARY KEY,
    password text NOT NULL
);

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
    id integer NOT NULL PRIMARY KEY,
    culture text NOT NULL
);
SELECT AddGeometryColumn('object', 'geometry', 4326, 'GEOMETRY', 2);
CREATE INDEX object_geometry_gist ON object USING GIST (geometry);

-- Table Description
CREATE TABLE description (
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
