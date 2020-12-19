# Server

## Installation

You need to install `nodemon` globally, from NPM, which can be done by:

```bash
npm install -g nodemon
```

> ***Note:*** *Or you can run node on the `server.js` file to start the application,
instead of running `npm start`.*

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

You will need to start by creating a new user, by making a **POST** request to the
`/api/users` endpoint, containing the following:

```json
{
  "username": "<your_username>",
  "surname": "<your_surname>",
  "name": "<your_name>",
  "password": "<your_password>",
  "is_professor": <0 or 1, where 0 means false and 1 means true>
}
```

Next, you will need to make a **POST** request to the `/api/sessions/login` endpoint,
containing:

```json
{
  "username": "<your_username>",
  "password": "<your_password>"
}
```

You will receive a response such as the following:

```json
{
  "token": "<your_new_access_token>"
}
```

In order to make requests to any other routes, you will need to authenticate by setting
the `Authorization` header to `Bearer <your_new_access_token>`.
