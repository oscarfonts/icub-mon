import argparse
import os.path
import psycopg2
from recordtype import recordtype
from psycopg2 import extras
from lxml import etree

# Input param
parser = argparse.ArgumentParser()
parser.add_argument("file", help="location of LIDO xml file to process")
args = parser.parse_args()
filename = args.file;

# DB Connection
conn = psycopg2.connect("dbname=mcm user=mcm password=mcm")
cur = conn.cursor(cursor_factory=psycopg2.extras.NamedTupleCursor)

# Insert continent
continent_name = os.path.splitext(os.path.split(args.file)[1])[0].capitalize();

# Insert continent if not extists
cur.execute("INSERT INTO continent (nom) SELECT %s WHERE NOT EXISTS (SELECT 1 FROM continent WHERE nom=%s);", [continent_name, continent_name])
conn.commit()
cur.execute("SELECT * FROM continent WHERE nom=%s;", [continent_name])
continent = cur.fetchone()

# Data types as mutable recordtypes
Continent = recordtype('Continent', 'id nom', default=None)
Cultura = recordtype('Cultura', 'id continent nom', default=None)
Peca = recordtype('Peca', 'id id_lido id_cataleg cultura titol tipus material inscripcio data_descr data_min data_max mida_descr mida_alt mida_ample mida_profund relacionat', default=None)
Lloc = recordtype('Lloc', 'id continent cultura peca geom', default=None)

# Read & find text nodes
xml = etree.parse(filename);
namespaces = {'lido': 'http://www.lido-schema.org'}
x_peces = xml.xpath("/lido:lidoWrap/lido:lido", namespaces=namespaces)

# Display xpath for non-void text nodes
for x_peca in x_peces:
  peca = Peca()
  peca.id_lido = x_peca.xpath("lido:lidoRecID/text()", namespaces=namespaces)
  print peca.id_lido
#  if len(text.strip()) > 0:
#    print text.encode("utf8")

# Make the changes to the database persistent
#conn.commit()

# Close communication with the database
cur.close()
conn.close()
