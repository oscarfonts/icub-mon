from flask.ext.restless import APIManager
import geojson
from database import db
import model

def init_rest(app):
	manager = APIManager(app, flask_sqlalchemy_db=db)

	# Tweak JSON output to work in UTF8
	app.config['JSON_AS_ASCII'] = False

	manager.create_api(model.Continent,
		methods=['GET'],
		results_per_page = -1,
		postprocessors = {
			'GET_MANY': [pagination_remover]
		}
	)

	manager.create_api(model.Cultura,
		methods=['GET'],
		results_per_page = -1,
		postprocessors = {
			'GET_MANY': [pagination_remover]
		}
	)
	
	manager.create_api(model.Peca,
		methods=['GET'],
		results_per_page = -1,
		postprocessors = {
			'GET_MANY': [pagination_remover]
		}
	)

	manager.create_api(model.Cultura_geometry,
		methods=['GET','PUT','POST','DELETE'],
		results_per_page = -1,
		preprocessors = {
			'PUT_SINGLE': [fromGeoJSON],
			'POST':  [fromGeoJSON]
		},
		postprocessors = {
			'GET_SINGLE': [toGeoJSON],
			'GET_MANY': [toGeoJSON],
			'POST': [toGeoJSON]
		}
	)

	manager.create_api(model.Peca_geometry,
		methods=['GET','PUT','POST','DELETE'],
		results_per_page = -1,
		preprocessors = {
			'PUT_SINGLE': [fromGeoJSON],
			'POST':  [fromGeoJSON]
		},
		postprocessors = {
			'GET_SINGLE': [toGeoJSON],
			'GET_MANY': [toGeoJSON],
			'POST': [toGeoJSON]
		}
	)

	manager.create_api(model.Cultura_feature,
		methods=['GET'],
		results_per_page = -1,
		postprocessors = {
			'GET_SINGLE': [toGeoJSON],
			'GET_MANY': [toGeoJSON]
		}
	)

	manager.create_api(model.Peca_feature,
		methods=['GET'],
		results_per_page = -1,
		postprocessors = {
			'GET_SINGLE': [toGeoJSON],
			'GET_MANY': [toGeoJSON]
		}
	)

def pagination_remover(result=None, **kw):
	if result:
		result.pop("num_results", None)
		result.pop("page", None)
		result.pop("total_pages", None)

def fromGeoJSON(instance_id=None, data=None, **kw):
	row = geojson.loads(data, 4326)
	data.clear()
	data.update(row)

def toGeoJSON(result=None, **kw):
	doc = geojson.dumps(result)
	result.clear()
	result.update(doc)
