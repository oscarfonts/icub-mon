Catàleg web per al Museu de Cultures del Món
============================================

Consisteix en:

1. Un model de dades PostGIS. El podeu trobar a utils/database/create_db.sql

2. Una API REST per:
    * consultar els 4 continents en que es divideix el museu,
    * consultar i editar l'àmbit geogràfic de totes les cultures i peces (punts o polígons),
    * consultar i editar les descripcions de cada cultura, en multiidioma.

3. Una aplicació web (100% javascript estàtic, sense codi executant-se al servidor) per a la navegació pel catàleg del MCM. Inclou:
    * Clients javascript per a la CELAPI i per a la API pròpia del MCM.
    * Apartat d'administració per a l'edició de continguts a través de la API del MCM.

Demos:

    * Web pública: http://mcm.fonts.cat
    * API MCM: http://mcm.fonts.cat/api
    * Web d'administració: http://mcm.fonts.cat/admin

Referències externes:

    * Web general MCM: http://museuculturesmon.bcn.cat
    * CELAPI docs: http://docs.celapi.apiary.io
    * CELAPI testing endpoint: http://celapi.agilogy.net/api/1
    * CELAPI production endpoint: http://vps41774.ovh.net/api/1


Instal·lació a producció
========================

Instruccions pas a pas per a Ubuntu 12.04 (maig 2014).


Codi font
.........

Instal·lar git, node (amb npm) i requirejs::

   apt-get install git python-software-properties
   apt-add-repository ppa:chris-lea/node.js
   apt-get update
   apt-get install nodejs
   npm install -g requirejs

Baixar-se el codi::

   mkdir -p /var/www/mcm
   cd /var/www/mcm
   git clone https://github.com/oscarfonts/icub-mon.git .

Minificar el web::

   cd web
   r.js -o build/build.js

El codi del web minificat es crearà al directori "dist".


Base de dades
.............

Instal·lar PostgreSQL (9.1) i PostGIS (2.0)::

   apt-get install postgresql postgresql-9.1-postgis-2.0 postgresql-server-dev-9.1

A /etc/postgresql/9.1/main/pg_hba.conf::

   # TYPE  DATABASE        USER            ADDRESS                 METHOD
   local   all             postgres                                ident
   local   all             all                                     md5
   host    all             all             127.0.0.1/32            md5

I a /etc/postgresql/9.1/main/postgresql.conf, descomentar::

   listen_addresses = 'localhost'

Reiniciar per aplicar canvis::

   service postgresql restart

Per crear la BDD, cal executar un script SQL::

   sudo -u postgres psql < /var/www/mcm/utils/database/create_db.sql


Entorn de Python
................

::

   apt-get install python-pip python-dev
   pip install virtualenv
   cd /var/www/mcm
   virtualenv virtualenv
   source virtualenv/bin/activate
   pip install -r api/requirements.txt


Servidor Apache
...............

#. Install apache and wsgi module::

   apt-get install apache2
   apt-get install libapache2-mod-wsgi


#. Create the file ``/etc/apache2/sites-available/mcm.conf`` with::

    <VirtualHost mcm.fonts.cat:80>
        ServerAdmin gerard@gmm.cat
        ServerName mcm.fonts.cat
        DocumentRoot /var/www/mcm/web/dist/
        ErrorLog /var/www/mcm/logs/error.log
        CustomLog /var/www/mcm/logs/access.log combined
        LogLevel warn

        WSGIScriptAlias /api /var/www/mcm/api/app.wsgi
        WSGIPassAuthorization On
        <Directory /var/www/mcm/api/app.wsgi>
            Order allow,deny
            Allow from all
        </Directory>
    </VirtualHost>

#. Create logs directory::

   mkdir -p /var/www/mcm/logs

#. Edit ``/var/www/mcm/api/app.wsgi`` and check the paths::

   activate_this = '/var/www/mcm/virtualenv/bin/activate_this.py'
   [...]
   sys.path.insert(0, '/var/www/mcm/api')

#. Edit ``/var/www/mcm/api/config.py``, switch debug mode to ``False``, and edit connection strings and secret key.

#. Enable site & restart apache::

   a2dissite default
   a2ensite mcm.conf
   service apache2 reload
