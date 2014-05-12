======================================
Instal·lació i configuració de PostGIS
======================================

Instal·lar PostgreSQL (9.1) i PostGIS (2.0)::

	apt-get install postgresql
	apt-get install postgresql-9.1-postgis-2.0


Habilitar accés local. A /etc/postgresql/9.1/main/pg_hba.conf::

	# TYPE  DATABASE        USER            ADDRESS                 METHOD
	local   all             postgres                                ident
	local   all             all                                     md5
	host    all             all             127.0.0.1/32            md5

I a /etc/postgresql/9.1/main/postgresql.conf, descomentar::

    listen_addresses = 'localhost'

Reiniciar per aplicar canvis::

	service postgresql restart

Per accedir a la consola SQL::

	sudo -u postgres psql

