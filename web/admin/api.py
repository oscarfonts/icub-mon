from flask_restless import APIManager, ProcessingException
from flask import session
from utils import rest
from database import db
import model

def create_api(app, url_prefix='/api'):

    manager = APIManager(app, flask_sqlalchemy_db=db)

    manager.create_api(model.Cultura_geometry,
        url_prefix=url_prefix,
		methods=['GET','PUT','POST','DELETE'],
		results_per_page = -1,
		preprocessors = {
			'GET_SINGLE': [auth],
			'GET_MANY': [auth],
			'PUT_SINGLE': [auth, rest.fromGeoJSON],
			'POST':  [auth, rest.fromGeoJSON],
			'DELETE': [auth]
		},
		postprocessors = {
			'GET_SINGLE': [rest.toGeoJSON],
			'GET_MANY': [rest.toGeoJSON],
			'POST': [rest.toGeoJSON]
		}
	)

    manager.create_api(model.Peca_geometry,
        url_prefix=url_prefix,
		methods=['GET','PUT','POST','DELETE'],
		results_per_page = -1,
		preprocessors = {
			'GET_SINGLE': [auth],
			'GET_MANY': [auth],
			'PUT_SINGLE': [auth, rest.fromGeoJSON],
			'POST':  [auth, rest.fromGeoJSON],
			'DELETE': [auth]
		},
		postprocessors = {
			'GET_SINGLE': [rest.toGeoJSON],
			'GET_MANY': [rest.toGeoJSON],
			'POST': [rest.toGeoJSON]
		}
	)

def auth(**kw):
    if not session.get('logged_in'):
        raise ProcessingException(message='Access forbidden!', status_code=403)
