#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os, sys

sys.path.append('/mnt/d/DocumentsOscar/projects/icub/src/web/app')

def application(request, response):
	
	uri = request['REQUEST_URI']

	if uri == '/icub/tree.json':
		response('200 OK', [('Content-Type', 'application/json; charset=utf-8')])
		from db2json import db2json
		return db2json().encode('utf-8')
	if uri == '/icub/':
		fin = open('/mnt/d/DocumentsOscar/projects/icub/src/web/static/index.html', "rb")
		response('200 OK', [('Content-Type', 'text/html; charset=utf-8')])
		return fin.read()
	else:
		response('404 Not Found', [('Content-Type', 'text/html; charset=utf-8')])
		return "Page not found"
