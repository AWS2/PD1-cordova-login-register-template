# Exercici de login i registre en Cordova

Enunciat de l'exercici a resoldre utiltizant Apache Cordova:
https://bytes.cat/introduccio_javascript#exercici_de_login_i_registre

Apunts de Cordova:
https://bytes.cat/cordova

Instal·lació de Cordova:
https://bytes.cat/cordova_install


## Desenvolupament

Un cop instal·lat Apache Cordova pots posar en marxa el projecte amb:

    $ cordova platform add browser
    $ cordova run browser

Caldrà que desenvolupis el codi a la carpeta www/ per complir amb els tests.


## Tests
Requisits:
  * NodeJS >= 20.10
  * Firefox-ESR (no serveix la versió *snap* que sol venir en Ubuntu)

Canviar a Firefox-ESR en Ubuntu:

    # snap remove firefox
    # apt install software-properties-common -y
    # add-apt-repository ppa:mozillateam/ppa
    # apt install firefox-esr


Per executar els tests:

    $ cd .test
    $ npm install
    $ node 01-login-ok.js

Si els vols executar en mode HEADLESS:

    $ HEADLESS=true node 01-login-ok.js

Si tens Chrome instal·lat i vols executar-hi els tests:

    $ CHROME_TESTS=true node 01-login-ok.js


...i així successivament amb la resta de tests en la carpeta. Cadascun hauria de donar com a resultat "TEST OK".
