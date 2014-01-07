from flask_restless import APIManager
from utils import rest
from database import db
import model

def create_api(app, auth):
	manager = APIManager(app, flask_sqlalchemy_db=db)

	manager.create_api(model.Culture,
		methods=['GET','PUT','POST','DELETE'],
		results_per_page = -1,
		preprocessors = {
			'PUT_SINGLE': [auth, rest.fromGeoJSON],
			'POST':  [auth, rest.fromGeoJSON],
			'DELETE': [auth]
		},
		postprocessors = {
			'GET_SINGLE': [rest.toGeoJSON],
			'GET_MANY': [rest.toGeoJSON],
			'PUT_SINGLE': [rest.toGeoJSON],
			'POST': [rest.toGeoJSON]
		}
	)

	manager.create_api(model.Object,
		methods=['GET','PUT','POST','DELETE'],
		results_per_page = -1,
		preprocessors = {
			'PUT_SINGLE': [auth, rest.fromGeoJSON],
			'POST':  [auth, rest.fromGeoJSON],
			'DELETE': [auth]
		},
		postprocessors = {
			'GET_SINGLE': [rest.toGeoJSON],
			'GET_MANY': [rest.toGeoJSON],
			'PUT_SINGLE': [rest.toGeoJSON],
			'POST': [rest.toGeoJSON]
		}
	)
	
	manager.create_api(model.Description,
		methods=['GET','PUT','POST','DELETE'],
		results_per_page = -1,
		preprocessors = {
			'PUT_SINGLE': [auth],
			'POST':  [auth],
			'DELETE': [auth]
		},
		postprocessors = {
            'GET_MANY': [rest.removePagination]
        }
	)
