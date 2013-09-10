Load MCM data from LIDO files
=============================

Create database schema
----------------------

Needs `postgresql` and `postgis`::

  sudo add-apt-repository ppa:ubuntugis/ubuntugis-unstable
  sudo apt-get update
  sudo apt-get install postgis

Edit ``pg_hba.conf`` allowing connections for `postgres` and `mcm` users::

  # TYPE  DATABASE        USER            ADDRESS                 METHOD
  local   mcm             mcm                                     md5

Run schema creation script::

  sudo su postgres
  cd sql
  ./create_db.sh


Load data from LIDO
-------------------

Needs ``lxml`` python package. So::

  sudo apt-get install libxml2-dev libxsl1
  pip install lxml

Now load data::

  cd ..
  ./lido2db.sh


Check data & change `mcm` password
----------------------------------

::

  psql -U mcm
  select * from continent;
  alter user mcm with password '<new_password>';
  \q
