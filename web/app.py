from flask import Flask, render_template
from database import db
import api
from admin.app import admin

app = Flask(__name__)

# Load configuration
app.config.from_object('config')

# Init database (& model)
db.init_app(app)

# Init API
api.init_rest(app)

# Only index view
@app.route('/')
def index():
    return render_template('index.html')

# Add admin subsite
app.register_blueprint(admin, url_prefix='/admin')

# Start flask, with debug flags as needed
aptana = app.config.get('DEBUG_WITH_APTANA')
app.run(debug=app.debug, use_debugger=not(aptana), use_reloader=not(aptana))
