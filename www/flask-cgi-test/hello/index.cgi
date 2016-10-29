#!/home/sojo-patchworks/local/python/bin/python3

import cgitb
cgitb.enable()

import sys
sys.path.append('/home/sojo-patchworks/.local/bin/flask')

from wsgiref.handlers import CGIHandler
from appFlask import app
CGIHandler().run(app)
