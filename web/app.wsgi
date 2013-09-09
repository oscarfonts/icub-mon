#!/usr/bin/env python
# -*- coding: utf-8 -*-
activate_this = '/mnt/d/DocumentsOscar/projects/icub/src/icub_env/bin/activate_this.py'
execfile(activate_this, dict(__file__=activate_this))

import sys
sys.path.insert(0, '/mnt/d/DocumentsOscar/projects/icub/src/web')

from app import app as application
