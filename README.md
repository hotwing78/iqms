
##Required
| Technology | Site |
| --- | --- |
| PostgreSQL | http://www.postgresql.org/download/ |
| Node | https://nodejs.org/en/download/package-manager/ |
| Firebase | https://console.firebase.google.com/ |

Clone the project from the repository:
```	
$ git clone https://github.com/Geocent/iqms
```

Change directory to project:
```	
$ cd iqms
```

Install node dependencies via npm:
```	
$ npm install
```

Set up psql in separate terminal:
```
$ psql
$ ALTER USER postgres WITH PASSWORD '1233456';
$ CREATE DATABASE iqms_development;
```

To start: back in /iqms:
```
$ chmod +x bin/www_test
$ cd bin
$ ./www_test
```	

To open app: from a browser, go to:
```
http://localhost:3000/static/www/
```	

###Notes:

bin/www is daemonized, bin/www_test is not  
tests can be ran with `$ mocha`

####Setting Up Firebase

Open up browser and go to:
```
https://console.firebase.google.com/
```

Click the Create New Project button and fill out details about the project (the name).

Once your project has been created, you should be able to gather the majority of the needed configuration information for the config.json.

After your project is created, click the button that reads 'Add Firebase to your web app'. After loading, it will generate information for your project.

Fill out the config.json fields:

| config.json key | Corresponding Firebase information |
| --- | ---|
| firebaseApiKey | apiKey |
| firebaseAuthDomain | authDomain |
| firebaseDatabaseURL | databaseURL |

Once those fields are configured, you need to generate the authentication JSON for the server to authenticate users.


To do this, click the settings gear in the top left corner of the Firebase console and select Permissions from the menu.


Select Service accounts in the left sidebar menu.


At the top of the screen click Create Service Account and fill out the Service account name.


Be sure to select the 'Furnish a new private key' option and make sure you choose JSON for the output.


Click create and it should create your new Service account and download a JSON file to your machine.


Move this JSON file to your config folder in the root of your project and change the key of your config.json to match this model:

```
     "firebaseServiceAccount": "../config/<filename>.json"
```

Firebase should be operational at this point and all authentication (frontend and backend) should be working.


####Command Line for PostgreSQL

```
$ psql (starts PostgreSQL so that other commands can be run)
DROP DATABASE <name> (deletes the database)
CREATE DATABASE <name> (creates the database)
/l (lists databases)
/c <name> (connects to database <name>)
/dt (lists all tables in connected database)
/d <table> (displays columns of <table> in connected database)
```
Whenever any of the model files are modified, the database must be dropped and re-created, and the server must be restarted. Otherwise, the changes will not take place and errors can occur.


####Configuration:

A config.json should be created and placed in the config folder of the root of the project. default.config.json is a template of the properties needed for the config.json file.

<table>
  <tr>
    <td>username</td>
    <td>This is the username for connecting to the database</td>
  </tr>
  <tr>
    <td>password</td>
    <td>This is the password for connecting to the database</td>
  </tr>
  <tr>
      <td>database</td>
      <td>This is the name of the database</td>
  </tr>
  <tr>
      <td>host</td>
      <td>This is where the database is hosted</td>
  </tr>
  <tr>
        <td>dialect</td>
        <td>This is the type of databse</td>
  </tr>
  <tr>
    <td>port</td>
    <td>This is the port used to connect with the database</td>
  </tr>
  <tr>
    <td>mainPort</td>
    <td>This is the main port used in the url to connect to the IQMS</td>
  </tr>
  <tr>
    <td>webSocketHost</td>
    <td>This is the host for the web sockets</td>
  </tr>
  <tr>
    <td>webSocketPort</td>
    <td>This is the port that the web sockets communicate on</td>
  </tr>
  <tr>
    <td>firebaseApiKey</td>
    <td>This is the key generated by Firebase to allow the IQMS access to Firebase</td>
  </tr>
  <tr>
    <td>firebaseAuthDomain</td>
    <td>This is the domain for the Firebase account that allows authorization processes</td>
  </tr>
  <tr>
    <td>firebaseDatabaseURL</td>
    <td>This is the URL of the Firebase database (not currently used with the IQMS, however, it is needed to initialize Firebase)</td>
  </tr>
  <tr>
    <td>firebaseServiceAccount</td>
    <td>Local URL location for the service account authorization needed for the backend IQMS server so that it can authenticate RESTful requests</td>
  </tr>
</table>