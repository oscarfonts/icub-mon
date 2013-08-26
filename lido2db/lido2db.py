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
try:
  cur.execute("INSERT INTO continent (nom) SELECT %s WHERE NOT EXISTS (SELECT 1 FROM continent WHERE nom=%s);", [continent_name, continent_name])
  conn.commit()
  #print "Inserted Continent", continent_name
except Exception, e:
  print e.pgerror
  print peca
  conn.rollback()

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
  peca.id_lido = x_peca.xpath("lido:lidoRecID/text()", namespaces=namespaces)[0]

  x_oi = x_peca.xpath("lido:descriptiveMetadata/lido:objectIdentificationWrap", namespaces=namespaces)[0]
  peca.id_cataleg = x_oi.xpath("lido:repositoryWrap/lido:repositorySet/lido:workID/text()", namespaces=namespaces)[0]

  try:  
    peca.titol = x_oi.xpath("lido:titleWrap/lido:titleSet/lido:appellationValue/text()", namespaces=namespaces)[0]
  except IndexError:
  	peca.titol = None

  try:
  	peca.tipus = x_oi.xpath("lido:objectWorkTypeWrap/lido:objectWorkType/lido:term/text()", namespaces=namespaces)[0]
  except IndexError:
  	peca.tipus = None

  try:
    peca.inscripcio = x_oi.xpath("lido:inscriptionsWrap/lido:inscriptions/lido:inscriptionTranscription/text()", namespaces=namespaces)[0]
  except IndexError:
  	peca.inscripcio = None

  x_om = x_oi.xpath("lido:objectMeasurementsWrap/lido:objectMeasurementsSet", namespaces=namespaces)
  if len(x_om) > 0:
    x_om = x_om[0]
    peca.mida_descr = x_om.xpath("lido:displayObjectMeasurements/text()", namespaces=namespaces)[0]
    for x_ms in x_om.xpath("lido:objectMeasurements/lido:measurementsSet", namespaces=namespaces):
      dimensio = x_ms.xpath("lido:measurementType/text()", namespaces=namespaces)[0]
      mida = x_ms.xpath("lido:measurementUnit/text()", namespaces=namespaces)[0]
      mida = float(mida.replace(",", "."))
      if dimensio == u'Al\xe7ada':
      	peca.mida_alt = mida
      elif dimensio == 'Amplada':
      	peca.mida_ample = mida
      elif dimensio == 'Profunditat':
      	peca.mida_profund = mida
  
  x_a = x_peca.xpath("lido:descriptiveMetadata/lido:eventWrap/lido:eventSet/lido:event/lido:eventActor/lido:actorInRole/lido:actor", namespaces=namespaces)[0]
  
  try:
    peca.cultura = x_a.xpath("lido:actorID/text()", namespaces=namespaces)[0]
    cultura = Cultura()
    cultura.id = peca.cultura
    cultura.continent = continent.id
    cultura.nom = x_a.xpath("lido:nameActorSet/lido:appellationValue/text()", namespaces=namespaces)[0]
  
    # Insert cultura if not exists
    try:
      cur.execute("INSERT INTO cultura (id, continent, nom) SELECT %s, %s, %s WHERE NOT EXISTS (SELECT 1 FROM cultura WHERE id=%s);", [cultura.id, cultura.continent, cultura.nom, cultura.id])
      conn.commit()
      #print "Inserted Cultura", cultura.nom
    except Exception, e:
      print e.pgerror
      print peca
      conn.rollback()
  except IndexError:
  	peca.cultura = None

  x_e = x_peca.xpath("lido:descriptiveMetadata/lido:eventWrap/lido:eventSet/lido:event", namespaces=namespaces)[0]

  try:
    peca.material = x_e.xpath("lido:eventMaterialsTech/lido:displayMaterialsTech/text()", namespaces=namespaces)[0]
  except IndexError:
  	peca.material = None

  try:
    peca.data_descr = x_e.xpath("lido:eventDate/lido:displayDate/text()", namespaces=namespaces)[0]
  except IndexError:
  	peca.data_descr = None
  try:
    peca.data_min = x_e.xpath("lido:eventDate/lido:date/lido:earliestDate/text()", namespaces=namespaces)[0]
  except IndexError:
  	peca.data_min = None

  # TODO: Check mandatory fields on peca

  # Insert peca
  try:
    cur.execute("INSERT INTO peca (id_lido, id_cataleg, cultura, titol, tipus, material, inscripcio, data_descr, data_min, data_max, mida_descr, mida_alt, mida_ample, mida_profund, relacionat) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, to_date(%s, 'YYYY'), to_date(%s, 'YYYY'), %s, %s, %s, %s, %s);",
  	  [peca.id_lido, peca.id_cataleg, peca.cultura, peca.titol, peca.tipus, peca.material, peca.inscripcio, peca.data_descr, peca.data_min, peca.data_max, peca.mida_descr, peca.mida_alt, peca.mida_ample, peca.mida_profund, peca.relacionat])
    conn.commit()
    #print "Inserted Peca", peca.id_cataleg
  except Exception, e:
    print e.pgerror
    print peca
    conn.rollback()

# Close communication with the database
cur.close()
conn.close()
