-- DROP DATABASE mcm;
-- DROP ROLE mcm;

-- User
CREATE ROLE mcm LOGIN ENCRYPTED PASSWORD 'md5e2cb82178fe76945f9eaefe00e9f7edc'
   VALID UNTIL 'infinity';

-- Database
CREATE DATABASE mcm
  WITH ENCODING='UTF8'
       OWNER=mcm
       TEMPLATE=template_postgis
       CONNECTION LIMIT=-1;

\connect mcm

-- Schemas
CREATE SCHEMA data;
CREATE SCHEMA geo;
ALTER DATABASE mcm SET search_path=data,geo,public;

\connect mcm

-- Table Continent
CREATE SEQUENCE continent_id_seq;
CREATE TABLE continent (
    id integer NOT NULL DEFAULT nextval('continent_id_seq') PRIMARY KEY,
    nom text NOT NULL
);
ALTER SEQUENCE continent_id_seq OWNED BY continent.id;

-- Table Cultura
CREATE SEQUENCE cultura_id_seq;
CREATE TABLE cultura (
    id integer NOT NULL PRIMARY KEY,
    continent integer NOT NULL,
    nom text NOT NULL,
    FOREIGN KEY (continent) REFERENCES continent(id)
);

-- Old Table Cultura (from LIDO imports - uses seq as id)
--CREATE SEQUENCE cultura_id_seq;
--CREATE TABLE cultura (
--    id int NOT NULL DEFAULT nextval('cultura_id_seq') PRIMARY KEY,
--    continent int NOT NULL,
--    nom text NOT NULL,
--    FOREIGN KEY (continent) REFERENCES continent(id)
--);
--ALTER SEQUENCE cultura_id_seq OWNED BY cultura.id;

-- Table Peca
CREATE TABLE peca (
    id integer NOT NULL PRIMARY KEY,
    num_registre text NOT NULL UNIQUE,
    any_inici integer,
    any_final integer,
    datacio text,
    cultura integer,
    procedencia text,
    precisions_procedencia text,
    FOREIGN KEY (cultura) REFERENCES cultura(id)
);

-- Old Table Peca (from LIDO imports)
--CREATE SEQUENCE peca_id_seq;
--CREATE TABLE peca (
--	id int NOT NULL DEFAULT nextval('peca_id_seq') PRIMARY KEY,
--    id_lido text NOT NULL UNIQUE,
--    id_cataleg text NOT NULL UNIQUE,
--    cultura int, -- NOT NULL?
--    titol text, -- NOT NULL?
--    tipus text,
--    material text,
--    inscripcio text,
--    data_descr text, -- NOT NULL?
--    data_min int, -- NOT NULL?
--    data_max int, -- NOT NULL?
--    mida_descr text,
--    mida_alt NUMERIC(4, 1),
--    mida_ample NUMERIC(4, 1),
--    mida_profund NUMERIC(4, 1),
--    relacionat text,
--    FOREIGN KEY (cultura) REFERENCES cultura(id)
--);

-- Table cultura_geometry
CREATE TABLE geo.cultura_geometry (
	id integer NOT NULL PRIMARY KEY
);
SELECT AddGeometryColumn('cultura_geometry', 'geometry', 4326, 'GEOMETRY', 2);
CREATE INDEX cultura_geometry_gist ON cultura_geometry USING GIST (geometry);

-- INSERT INTO cultura_geometry(id, geometry) VALUES (42228, ST_GeomFromText('POLYGON((0 0,4 0,4 4,0 4,0 0),(1 1, 2 1, 2 2, 1 2,1 1))', 4326));

-- Table peca_geometry
CREATE TABLE geo.peca_geometry (
    id integer NOT NULL PRIMARY KEY
);
SELECT AddGeometryColumn('peca_geometry', 'geometry', 4326, 'GEOMETRY', 2);
CREATE INDEX peca_geometry_gist ON peca_geometry USING GIST (geometry);

-- View cultura_feature
CREATE OR REPLACE VIEW geo.cultura_feature AS 
 SELECT cultura.*, cultura_geometry.geometry FROM cultura
 LEFT OUTER JOIN cultura_geometry
 ON (cultura.id = cultura_geometry.id);

-- View peca_feature
CREATE OR REPLACE VIEW geo.peca_feature AS 
 SELECT peca.*, peca_geometry.geometry FROM peca
 LEFT OUTER JOIN peca_geometry
 ON (peca.id = peca_geometry.id);

-- Role privileges
GRANT USAGE ON SCHEMA data TO mcm;
GRANT USAGE ON SCHEMA geo TO mcm;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO mcm;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA data TO mcm;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA geo TO mcm;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO mcm;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA data TO mcm;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA geo TO mcm;

-- Needed after restoring "data" schema:
-- SELECT Populate_Geometry_Columns();
