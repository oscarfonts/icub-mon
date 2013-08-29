#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os, sys

sys.path.append('/mnt/d/DocumentsOscar/projects/icub/src/web')

def application(request, response):
	
	uri = request['REQUEST_URI']

	if uri == '/tree.json':
		response('200 OK', [('Content-Type', 'application/json; charset=utf-8')])
		from db2json import db2json
		return db2json().encode('utf-8')
	else:
		response('404 Not Found', [('Content-Type', 'text/html; charset=utf-8')])
		return "Page not found"
