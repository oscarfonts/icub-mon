from flask import Flask
from database import db
import api

app = Flask(__name__)

# Load configuration
app.config.from_object('config')

# Init database (& model)
db.init_app(app)

# Init REST API
api.init_rest(app)

aptana = app.config.get('DEBUG_WITH_APTANA')

# Start flask
app.run(debug=app.debug, use_debugger=not(aptana), use_reloader=not(aptana))
