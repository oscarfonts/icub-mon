from flask import Flask, render_template
from database import db
import api
from admin import app as admin

app = Flask(__name__)

# Load configuration
app.config.from_object('config')

# Tweak JSON output to work in UTF8
app.config['JSON_AS_ASCII'] = False

# Database
db.init_app(app)

# REST API
api.create_api(app)

# View
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/peca')
def peca():
    return render_template('peca.html')

# Admin subsite
app.register_blueprint(admin.admin, url_prefix='/admin')
admin.create_api(app, url_prefix='/admin/api')

# Start flask as standalone
if __name__ == '__main__':
    aptana = app.config.get('DEBUG_WITH_APTANA')
    app.run(debug=app.debug, use_debugger=not(aptana), use_reloader=not(aptana))
