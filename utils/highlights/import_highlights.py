#!/usr/bin/env python
# -*- coding: utf-8 -*-
import csv
import psycopg2
from psycopg2 import extras

# Open DB Connection
conn = psycopg2.connect("dbname=mcm user=mcm password=mcm")
cur = conn.cursor(cursor_factory=psycopg2.extras.NamedTupleCursor)

# Read CSV file line by line
filesource = 'highlights.csv'
with open(filesource, 'rb') as f:
  reader = csv.DictReader(f, delimiter=',', quotechar='"')
  for row in reader:
    # Insert continent if not extists
    try:
      cur.execute("INSERT INTO continent (nom) SELECT %s WHERE NOT EXISTS (SELECT 1 FROM continent WHERE nom=%s);", [row["Continent"], row["Continent"]])
      conn.commit()
    except Exception, e:
      print e.pgerror
      conn.rollback()

    # Get continent tuple
    cur.execute("SELECT * FROM continent WHERE nom=%s;", [row["Continent"]])
    continent = cur.fetchone()

    # Insert cultura if not exists
    try:
      cur.execute("INSERT INTO cultura (id, continent, nom) SELECT %s, %s, %s WHERE NOT EXISTS (SELECT 1 FROM cultura WHERE id=%s);", [row["Id Cultura"], continent.id, row["Cultura"], row["Id Cultura"]])
      conn.commit()
    except Exception, e:
      print e.pgerror
      conn.rollback()

    # Insert peca
    statement = "INSERT INTO peca " + \
      "(id, num_registre, any_inici, any_final, datacio, cultura, procedencia, precisions_procedencia) " + \
      "VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
    try:
      cur.execute(statement, [row["Id Col·lecció"], row["Núm_ registre"], row["Any inici"], row["Any final"], row["Datació"], row["Id Cultura"], row["Procedència"], row["Precisions lloc procedencia"]])
      conn.commit()
    except Exception, e:
      print e.pgerror
      conn.rollback()

# Close communication with the database
cur.close()
conn.close()
