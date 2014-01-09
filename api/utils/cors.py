from flask import request

def add_cors_header(response):
    try:
        origin = request.headers["Origin"]
    except:
        origin = request.host_url
    
    response.headers['Access-Control-Allow-Origin'] = origin 
    response.headers['Access-Control-Allow-Methods'] = 'HEAD, OPTIONS, GET, POST, PUT, DELETE'
    response.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Content-Type'] = 'application/json; charset=utf-8'
    return response

def enable(app):
    app.after_request(add_cors_header)