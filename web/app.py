# -*- coding: utf-8 -*- 
from flask import Flask

from database import db
import model
import api

app = Flask(__name__)

app.config['DEBUG'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://mcm:mcm@127.0.0.1/mcm'
app.config['JSON_AS_ASCII'] = False

# Init SQLAlchemy (database & model)
db.init_app(app)

# Init REST API
api.init_rest(app)

# Start flask
app.run()
