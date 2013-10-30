#!/usr/bin/env python
# -*- coding: utf-8 -*-
import csv
import psycopg2
from psycopg2 import extras

# Open DB Connection
conn = psycopg2.connect("dbname=mcm user=mcm password=mcm")
cur = conn.cursor(cursor_factory=psycopg2.extras.NamedTupleCursor)

# query = "DELETE FROM cultura_geometry";
# cur.execute(query)
# conn.commit()

# query = "DELETE FROM peca_geometry";
# cur.execute(query)
# conn.commit()

filesource = 'peces.csv'
with open(filesource, 'rb') as f:
    reader = csv.DictReader(f, delimiter=',', quotechar='"')
    for row in reader:
        # Insert continent if not extists
        try:
            query = "INSERT INTO peca_geometry(id, geometry) \
                    VALUES(%s, ST_GeomFromText('POINT(%s %s)', 4326));" % \
                        (row["id"], row["lon"], row["lat"])
            cur.execute(query)
            conn.commit()
        except Exception, e:
            print e.pgerror
            conn.rollback()

filesource = 'cultures.csv'
with open(filesource, 'rb') as f:
    reader = csv.DictReader(f, delimiter=',', quotechar='"')
    for row in reader:
        # Insert continent if not extists
        try:
            query = "INSERT INTO cultura_geometry(id, geometry) \
                    VALUES(%s, ST_GeomFromText('POINT(%s %s)', 4326));" % \
                        (row["id"], row["lon"], row["lat"])
            cur.execute(query)
            conn.commit()
        except Exception, e:
            print e.pgerror
            conn.rollback()
