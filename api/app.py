from flask import Flask, send_file, jsonify, url_for
from flask_login import LoginManager, current_user
from flask_restless import ProcessingException
from flask_compress import Compress
from database import db
from model import User
import api

app = Flask(__name__)
app.config.from_object('config')
app.config['JSON_AS_ASCII'] = False

# Database
db.init_app(app)

# Authentication
login_manager = LoginManager()
login_manager.setup_app(app)

@login_manager.user_loader
def load_user(userid):
    return User.query.get(userid)

def auth(**kw):
    if not current_user.is_authenticated():
        raise ProcessingException(message='Access forbidden!', status_code=403)

# REST API
api.create_api(app, auth)

# Other API views
@app.route('/api')
def api():
    base = url_for("api", _external=True)
    return jsonify(continent = base + "/continent",
                   culture = base + "/culture",
                   object = base + "/object",
                   description = base + "/description")

@app.route('/api/continent')
def continent():
    return send_file("data/continents.geojson", mimetype="application/json")

Compress(app)


# Start flask as standalone
if __name__ == '__main__':
    aptana = app.config.get('DEBUG_WITH_APTANA')
    app.run(debug=app.debug, use_debugger=not(aptana), use_reloader=not(aptana))
