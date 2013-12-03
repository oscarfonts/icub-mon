#!/usr/bin/env python
# -*- coding: utf-8 -*-
import csv
import psycopg2
from psycopg2 import extras

# Open DB Connection
conn = psycopg2.connect("dbname=mcm user=mcm password=mcm")
cur = conn.cursor(cursor_factory=psycopg2.extras.NamedTupleCursor)

# Read CSV file line by line
filesource = 'highlights_africa_complete.csv'
with open(filesource, 'rb') as f:
  reader = csv.DictReader(f, delimiter=';', quotechar='"')
  for row in reader:
    # Insert continent if not extists
    try:
      cur.execute("INSERT INTO continent (nom) SELECT %s WHERE NOT EXISTS \
      	(SELECT 1 FROM continent WHERE nom=%s);", \
      	[row["Continent"], row["Continent"]])
      conn.commit()
    except Exception, e:
      print e.pgerror
      conn.rollback()

    # Get continent tuple
    cur.execute("SELECT * FROM continent WHERE nom=%s;", [row["Continent"]])
    continent = cur.fetchone()

    # Insert cultura if not exists
    try:
      cur.execute("""
      	INSERT INTO cultura (id, continent, nom)
      		SELECT %s, %s, %s
      		WHERE NOT EXISTS (SELECT 1 FROM cultura WHERE id=%s);
      	""",
      	[row["Id Cultura"], continent.id, row["Cultura"], row["Id Cultura"]])
      conn.commit()
    except Exception, e:
      print e.pgerror
      conn.rollback()

    # Insert peca
    statement = """
    	INSERT INTO peca
      		(id, num_registre, any_inici, any_final, datacio, cultura,
      		procedencia, precisions_procedencia, nom, nom_vernacle, dimensions,
      		precisions_material, geografia_historica, precisions_ingres,
      		historia_objecte, descripcio_sinopsi, context_utilitzacio)
      	VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
      	"""
    try:
      cur.execute(statement, [
      	row["Id Col·leccio"], row["Num Registre"],row["Any inici"],
      	row["Any final"], row["Datacio"], row["Id Cultura"],
      	row["Procedencia"], row["Precisions lloc procedencia"],
      	row["Nom objecte"], row["Nom vernacle"], row["Dimensions"],
      	row["Precisions material"], row["Geografia historica"],
      	row["Precisions ingres"], row["Historia objecte"],
      	row["Descripcio sinopsi"], row["Context utilitzacio"]
      ])
      conn.commit()
    except Exception, e:
      print e.pgerror
      conn.rollback()

# Close communication with the database
cur.close()
conn.close()
