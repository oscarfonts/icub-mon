from flask.ext.restless import APIManager
from utils import rest
from database import db
import model

def create_api(app):
	manager = APIManager(app, flask_sqlalchemy_db=db)

	# Tweak JSON output to work in UTF8
	app.config['JSON_AS_ASCII'] = False

	manager.create_api(model.Continent,
		methods=['GET'],
		results_per_page = -1,
		postprocessors = {
			'GET_MANY': [rest.removePagination]
		}
	)

	manager.create_api(model.Cultura,
		methods=['GET'],
		results_per_page = -1,
		postprocessors = {
			'GET_MANY': [rest.removePagination]
		}
	)
	
	manager.create_api(model.Peca,
		methods=['GET'],
		results_per_page = -1,
		postprocessors = {
			'GET_MANY': [rest.removePagination]
		}
	)

	manager.create_api(model.Cultura_feature,
		methods=['GET'],
		results_per_page = -1,
		postprocessors = {
			'GET_SINGLE': [rest.toGeoJSON],
			'GET_MANY': [rest.toGeoJSON]
		}
	)

	manager.create_api(model.Peca_feature,
		methods=['GET'],
		results_per_page = -1,
		postprocessors = {
			'GET_SINGLE': [rest.toGeoJSON],
			'GET_MANY': [rest.toGeoJSON]
		}
	)
