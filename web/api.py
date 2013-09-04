from flask.ext.restless import APIManager

from database import db
import model

def init_rest(app):
	manager = APIManager(app, flask_sqlalchemy_db=db)

	manager.create_api(model.Continent, methods=['GET'], results_per_page=-1, postprocessors={'GET_MANY': [pagination_remover]})
	manager.create_api(model.Cultura, methods=['GET'], results_per_page=-1, postprocessors={'GET_MANY': [pagination_remover]})
	manager.create_api(model.Peca, methods=['GET'], results_per_page=-1, postprocessors={'GET_MANY': [pagination_remover]})

def pagination_remover(result=None, **kw):
    if result:
        temp = result['objects']
        result.clear()
        result['objects'] = temp
