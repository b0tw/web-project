# Server

## Installation

You need to install `nodemon` globally, from NPM, which can be done by:

```bash
npm install -g nodemon
```

Afterwards, you will need to install the remaining dependencies, in order to
run the project. This can be done by executing:

```bash
# If not in the server directory, you can go there with:
# cd server
npm install
```

You will also need a running MySQL instance, on the default MySQL port of 3306.
The instance needs to be running on **localhost**.

You will need to create:

* a database named `sequelize`.
* a user named `sequelize`, with the password found in `appsettings.json`, having
at least READ/WRITE privileges on the aforementioned database.

**In order to seed the database (as well as recreate the tables), run the following
command:**

```bash
node seeds/initial_seed.js
```

## Running the application

```bash
npm start

# or

node server.js

# or

nodemon server.js
```

