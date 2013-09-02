# -*- coding: utf-8 -*- 
import flask
import flask.ext.sqlalchemy
import flask.ext.restless
import simplejson as json

# Create the Flask application and the Flask-SQLAlchemy object.
app = flask.Flask(__name__)
app.config['DEBUG'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://mcm:mcm@127.0.0.1/mcm'
app.config['JSON_AS_ASCII'] = False

db = flask.ext.sqlalchemy.SQLAlchemy(app)

class Continent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.Unicode)
    cultures = db.relationship('Cultura', backref=db.backref('x'))

class Cultura(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.Unicode)
    continent = db.Column(db.Integer, db.ForeignKey("continent.id"))


# Create the Flask-Restless API manager.
manager = flask.ext.restless.APIManager(app, flask_sqlalchemy_db=db)

# Create API endpoints, which will be available at /api/<tablename> by
# default. Allowed HTTP methods can be specified as well.
manager.create_api(Continent, methods=['GET'])

# start the flask loop
app.run()