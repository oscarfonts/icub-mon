Georreferenciació de col·leccions del Museu de Cultures del Món
===============================================================

Setup Python Virtualenv
-----------------------

::

 sudo pip install virtualenv
 virtualenv icub_env
 source icub_env/bin/activate


Install dependencies
--------------------

 ::

pip install -r dependencies.txt


Run in debug mode
-----------------

 ::

 python app.py


Code files
..........

* app.py: Entry point. Instantiates Flask, loads config, inits components.
* config.py: Configuration params. To be overwritten in production.
* database.py: Create Flask-SQLAlchemy handler.
* model.py: Database Model.
* api.py: Uses Flask-Restless to create the REST API endpoints.
