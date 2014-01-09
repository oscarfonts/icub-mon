from flask import send_file, jsonify, url_for
from flask_restless import APIManager
from utils import rest
from utils.auth import auth
from database import db
import model

def create_api(app):
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
	
	# Root view
	@app.route('/api')
	def api():
		base = url_for("api", _external=True)
		return jsonify(continent = base + "/continent",
	                   culture = base + "/culture",
	                   object = base + "/object",
	                   description = base + "/description")
	
	# Static "continent" view
	@app.route('/api/continent')
	def continent():
		return send_file("data/continents.geojson", mimetype="application/json; charset=utf-8")
