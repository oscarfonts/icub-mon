from flask import Blueprint, request, session, flash, redirect, render_template, url_for
from flask import current_app as app
import api

admin = Blueprint('admin', __name__, static_folder='static', template_folder='templates')

# Views
@admin.route('/')
def index():
    return render_template('admin/index.html')

@admin.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        if request.form['username'] != app.config['USERNAME']:
            error = 'Invalid username'
        elif request.form['password'] != app.config['PASSWORD']:
            error = 'Invalid password'
        else:
            session['logged_in'] = True
            return redirect(url_for('.index'))
    return render_template('admin/login.html', error=error)

@admin.route('/logout')
def logout():
    session.pop('logged_in', None)
    flash('You were logged out')
    return redirect(url_for('.index'))

def create_api(app, url_prefix):
    api.create_api(app, url_prefix)
