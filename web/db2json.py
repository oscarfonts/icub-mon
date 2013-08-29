#!/usr/bin/env python
# -*- coding: utf-8 -*- 
import psycopg2
import simplejson as json

def getDict(cursor):
  results = cursor.fetchall()
  if results is None: return None
  cols = [ d[0] for d in cursor.description ]
  ret = []
  for row in results:
    ret.append(dict(zip(cols, row)))
  return ret

def db2json():
  # Connect to DB
  conn = psycopg2.connect("dbname=mcm user=mcm password=mcm")
  cur = conn.cursor()

  # Get continents
  cur.execute("SELECT * FROM continent;")
  continents = getDict(cur);
  for continent in continents:
    # Get cultures
    cur.execute("SELECT * FROM cultura WHERE continent = %s;", [continent["id"]])
    continent["cultures"] = getDict(cur);
    for cultura in continent["cultures"]:
      # Get peces
      cur.execute("SELECT * FROM peca WHERE cultura = %s;", [cultura["id"]])
      cultura["peces"] = getDict(cur);

  # Close communication with the database
  cur.close()
  conn.close()

  # Print json
  return json.dumps(continents,sort_keys=True, indent=2, ensure_ascii=False)
