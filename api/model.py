from database import db
from geoalchemy2 import Geometry

class Culture(db.Model):
    id = db.Column(db.Text, primary_key=True)
    continent = db.Column(db.Text)
    geometry = db.Column(Geometry(geometry_type='GEOMETRY', srid=4326))

class Object(db.Model):
    id = db.Column(db.Text, primary_key=True)
    culture = db.Column(db.Text)
    geometry = db.Column(Geometry(geometry_type='GEOMETRY', srid=4326))

class Description_ca(db.Model):
    id = db.Column(db.Text, primary_key=True)
    html = db.Column(db.Text)

class Description_en(db.Model):
    id = db.Column(db.Text, primary_key=True)
    html = db.Column(db.Text)

class Description_es(db.Model):
    id = db.Column(db.Text, primary_key=True)
    html = db.Column(db.Text)
