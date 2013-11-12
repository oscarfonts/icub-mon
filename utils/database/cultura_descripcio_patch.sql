ALTER TABLE geo.cultura_geometry
   ADD COLUMN descripcio_html text;

CREATE OR REPLACE VIEW geo.cultura_feature AS 
 SELECT cultura.*, cultura_geometry.geometry FROM cultura
 LEFT OUTER JOIN cultura_geometry
 ON (cultura.id = cultura_geometry.id);
