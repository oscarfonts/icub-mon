MCMAPI - Extended API for the *Museu de Cultures del Món*
=========================================================

Python Flask application exposing a REST API to manipulate MCM specific data, namely culture and object geometries, and culture descriptions in multiple languages.

Uses PostGIS as backend, and serializes geospatial features as GeoJSON for better integration with web mapping applications.


Setup dev environment with virtualenvwrapper
--------------------------------------------

Install virtualenvwrapper::

 sudo apt-get install python-pip
 sudo pip install virtualenv
 sudo pip install virtualenvwrapper
 mkdir -p ~/.virtualenvs

Add virtualenvwrapper to your environment (eg to .bashrc)::

 export WORKON_HOME=~/.virtualenvs
 source /usr/local/bin/virtualenvwrapper.sh

Create virtualenv::

  mkvirtualenv icub

Activate it::

  workon icub

Install project packages::

  pip install -r requirements.txt


Run in debug mode
-----------------

 ::

 python app.py

