from database import db
from geoalchemy2 import Geometry

class Continent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.Unicode)
    #cultures = db.relationship('Cultura')

class Cultura(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.Unicode)
    continent = db.Column(db.Integer, db.ForeignKey("continent.id"))
    #peces = db.relationship('Peca')

class Peca(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    num_registre = db.Column(db.Unicode, unique=True)
    any_inici = db.Column(db.Integer)
    any_final = db.Column(db.Integer)
    datacio = db.Column(db.Unicode)
    cultura = db.Column(db.Integer, db.ForeignKey("cultura.id"))
    procedencia = db.Column(db.Unicode)
    precisions_procedencia = db.Column(db.Unicode)

class Cultura_geometry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    geometry = db.Column(Geometry(geometry_type='GEOMETRY', srid=4326))

class Peca_geometry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    geometry = db.Column(Geometry(geometry_type='GEOMETRY', srid=4326))

class Cultura_feature(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.Unicode)
    continent = db.Column(db.Integer, db.ForeignKey("continent.id"))
    geometry = db.Column(Geometry(geometry_type='GEOMETRY', srid=4326))

class Peca_feature(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    id_lido = db.Column(db.Unicode, unique=True)
    id_cataleg = db.Column(db.Unicode, unique=True)
    cultura = db.Column(db.Integer, db.ForeignKey("cultura.id"))
    titol = db.Column(db.Unicode)
    tipus = db.Column(db.Unicode)
    material = db.Column(db.Unicode)
    inscripcio = db.Column(db.Unicode)
    data_descr = db.Column(db.Unicode)
    data_min = db.Column(db.Integer)
    data_max = db.Column(db.Integer)
    mida_descr = db.Column(db.Unicode)
    mida_alt = db.Column(db.Numeric(4, 1))
    mida_ample = db.Column(db.Numeric(4, 1))
    mida_profund = db.Column(db.Numeric(4, 1))
    relacionat = db.Column(db.Unicode)
    geometry = db.Column(Geometry(geometry_type='GEOMETRY', srid=4326))
