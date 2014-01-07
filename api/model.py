from database import db
from geoalchemy2 import Geometry
from flask_login import UserMixin

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Unicode)
    password = db.Column(db.Unicode)

class Culture(db.Model):
    id = db.Column(db.Unicode, primary_key=True)
    continent = db.Column(db.Unicode)
    geometry = db.Column(Geometry(geometry_type='GEOMETRY', srid=4326))
    objects = db.relationship('Object')

class Object(db.Model):
    id = db.Column(db.Unicode, primary_key=True)
    culture = db.Column(db.Unicode, db.ForeignKey('culture.id'))
    geometry = db.Column(Geometry(geometry_type='GEOMETRY', srid=4326))

class Description(db.Model):
    id = db.Column(db.Unicode, primary_key=True)
    html_ca = db.Column(db.Unicode)
    html_es = db.Column(db.Unicode)
    html_en = db.Column(db.Unicode)
