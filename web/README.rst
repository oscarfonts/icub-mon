Georreferenciació de col·leccions del Museu de Cultures del Món
===============================================================

Setup Python Virtualenv
-----------------------

::

 sudo apt-get install python-pip
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


Run in production (Apache + mod_wsgi)
-------------------------------------

#. Add the following directives to ``httpd.conf``::

        Alias /icub/static/ /<path_to_app>/static/
        <Directory /<path_to_app>/static/>
                Order allow,deny
                Allow from all
        </Directory>

        WSGIScriptAlias /icub /<path_to_app>/app.wsgi
        <Directory /<path_to_app>/app.wsgi>
                Order allow,deny
                Allow from all
        </Directory>

        <Location "/icub">
             Order deny,allow
             Allow from all
             RewriteEngine on
             RewriteCond %{REQUEST_URI} ^/icub$
             RewriteRule ^(.*)$ %{REQUEST_URI}/ [R=301,L]
             #RewriteRule  !^.*/$  /icub/  [R]
        </Location>

        ErrorLog /<path_to_logs_dir>/py_errors.log
        CustomLog /<path_to_logs_dir>/py_access.log combined
        LogLevel debug  #debug, info, notice, warn, error, crit, alert, emerg

#. Edit ``app.wsgi`` and change the paths.

#. Edit ``config.py``, switch debug mode to ``False``, and edit connection string and secret key.
