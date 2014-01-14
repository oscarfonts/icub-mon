from hashlib import sha256
from database import db
from flask import request
from werkzeug.exceptions import HTTPException

class User(db.Model):
    username = db.Column(db.Text, primary_key=True)
    password = db.Column(db.Text)
    
    def __repr__(self):
        return '<User %r>' % self.username

class Challenge(HTTPException):
    code = 401
    description = "Unauthorized"
    
    def get_headers(self, environ):
        headers = HTTPException.get_headers(self, environ)
        headers.append(('WWW-Authenticate', 'Basic realm="MCM API"'))
        return headers

    def get_body(self, environ=None):       
        return '{ "code": %s, "description": "%s" }' % (self.code, self.description)

def auth(**kw):
    credentials = request.authorization
    if not credentials or not user_exists(credentials):
        raise Challenge()
    else:
        return True

def user_exists(credentials):
    username = credentials.username
    password = sha256(credentials.password).hexdigest()
    user = User.query.filter_by(username = username, password = password).first()
    return user is not None
