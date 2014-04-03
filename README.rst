Catàleg web per al Museu de Cultures del Món
============================================

Consisteix en:

1. Un model de dades a PostGIS. El podeu crear executant utils/database/create_db.sql

2. Una API REST de:
    * consulta dels 4 continents en que es divideix el museu,
    * consulta i edició de l'àmbit geogràfic de cultures i peces (punts o polígons),
    * consulta i edició de les descripcions multiidioma de les cultures.

3. Una aplicació web 100% javascript (sense codi al servidor) per a la navegació pel catàleg del MCM. Inclou:
    * Clients javascript per a la API anterior, i per a la CELAPI.
    * Apartat d'administració per a l'edició de continguts a través de la API anterior.

Demos:

    * API MCM: http://fonts.cat/mcmapi
    * Web pública: http://fonts.cat/icub/
    * Web d'administració: http://fonts.cat/icub/admin/

Referències externes:

    * CELAPI endpoint: http://celapi.agilogy.net/api/1
    * CELAPI docs: http://docs.celapi.apiary.io/
    * Web general MCM: http://museuculturesmon.bcn.cat/
