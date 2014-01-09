from flask import Flask
from flask_compress import Compress
from database import db
from utils import cors
import api

# Create app
app = Flask(__name__)

# Load configuration
app.config.from_object('config')
app.config['JSON_AS_ASCII'] = False

# Attach database
db.init_app(app)

# Create REST API
api.create_api(app)

# Enable compression
Compress(app)

# Enable Cross-Origin headers
cors.enable(app)

# Start flask as standalone
if __name__ == '__main__':
    aptana = app.config.get('DEBUG_WITH_APTANA')
    app.run(debug=app.debug, use_debugger=not(aptana), use_reloader=not(aptana))
