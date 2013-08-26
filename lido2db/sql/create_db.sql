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

-- Schema
CREATE SCHEMA data;
ALTER DATABASE mcm SET search_path=data,public;

\connect mcm

-- Table Continent
CREATE SEQUENCE continent_id_seq;
CREATE TABLE continent (
    id int NOT NULL DEFAULT nextval('continent_id_seq') PRIMARY KEY,
    nom text NOT NULL
);
ALTER SEQUENCE continent_id_seq OWNED BY continent.id;

-- Table Cultura
CREATE SEQUENCE cultura_id_seq;
CREATE TABLE cultura (
    id int NOT NULL DEFAULT nextval('cultura_id_seq') PRIMARY KEY,
    continent int NOT NULL,
    nom text NOT NULL,
    FOREIGN KEY (continent) REFERENCES continent(id)
);
ALTER SEQUENCE cultura_id_seq OWNED BY cultura.id;

-- Table Peca
CREATE SEQUENCE peca_id_seq;
CREATE TABLE peca (
	id int NOT NULL DEFAULT nextval('peca_id_seq') PRIMARY KEY,
    id_lido text NOT NULL UNIQUE,
    id_cataleg text NOT NULL UNIQUE,
    cultura int, -- NOT NULL?
    titol text, -- NOT NULL?
    tipus text,
    material text,
    inscripcio text,
    data_descr text, -- NOT NULL?
    data_min date, -- NOT NULL?
    data_max date, -- NOT NULL?
    mida_descr text,
    mida_alt NUMERIC(4, 1),
    mida_ample NUMERIC(4, 1),
    mida_profund NUMERIC(4, 1),
    relacionat text,
    FOREIGN KEY (cultura) REFERENCES cultura(id)
);

-- Table Lloc
CREATE SEQUENCE lloc_id_seq;
CREATE TABLE lloc (
	id int NOT NULL DEFAULT nextval('lloc_id_seq') PRIMARY KEY,
	continent int,
	cultura int,
	peca int,
	FOREIGN KEY (continent) REFERENCES continent(id),
	FOREIGN KEY (cultura) REFERENCES cultura(id),
	FOREIGN KEY (peca) REFERENCES peca(id)
);
ALTER SEQUENCE cultura_id_seq OWNED BY lloc.id;
SELECT public.AddGeometryColumn('lloc', 'geom', 4326, 'GEOMETRY', 2);
CREATE INDEX lloc_geom_gist ON lloc USING GIST (geom);

-- Role privileges
GRANT USAGE ON SCHEMA data TO mcm;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO mcm;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA data TO mcm;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO mcm;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA data TO mcm;

-- Needed after restoring "data" schema:
-- SELECT Populate_Geometry_Columns();
