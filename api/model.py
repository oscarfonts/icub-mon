from database import db
from geoalchemy2 import Geometry

class Culture(db.Model):
    id = db.Column(db.Text, primary_key=True)
    continent = db.Column(db.Text)
    geometry = db.Column(Geometry(geometry_type='GEOMETRY', srid=4326))
    #objects = db.relationship('Object')

class Object(db.Model):
    id = db.Column(db.Text)
    culture = db.Column(db.Text, db.ForeignKey('culture.id'))
    geometry = db.Column(Geometry(geometry_type='GEOMETRY', srid=4326))

class Description(db.Model):
    id = db.Column(db.Text, primary_key=True)
    html = db.Column(db.Text)
