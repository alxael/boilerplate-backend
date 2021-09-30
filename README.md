# Boilerplate Back-End

This project is a RESTful API designed for product management.

## Features

At the moment, the API has endpoints for products, users and user roles. The API uses JWT to sign claims securely.

NodeJS is used to run the whole application. Express is used to provide server-side logic for the web application. MongoDB is used to handle the storage and management of the data. Swagger is used to document and interact manually with the API.

## Technologies used

The project uses the following technologies to work:

- [NodeJS](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Swagger](https://swagger.io/tools/swagger-codegen/)

## Installation

The API requires [NodeJS](https://nodejs.org/en/) version 14 or newer to work and [MongoDB](https://www.mongodb.com/). First, clone the repository.

```console
git clone https://github.com/alxael/boilerplate-backend.git
```

After this, install the packages with ```npm install```. Make sure you have MongoDB installed and set up properly to run locally. The application connects by default to ```mongodb://localhost:27017``` in the ```myapp``` database.

You will also need to add with ```touch .env``` the ```.env``` file, which should have the following structure:

```dosini
NODE_ENV=development
PORT=4000
DB_LINK=mongodb://localhost:27017/myapp
TOKEN_KEY=*random text*
```

## Usage

First, start up the MongoDB server. If you are running it locally, open a new terminal and type in ```mongod```.

To run the project, simply do an ```npm start``` command. To interact with the API, access ```localhost:4000/api-docs```.

In order to use the API fully, first create a new user using the ```/user/register``` endpoint.db.u Then authenticate with the user token by inserting it into the window that pops up when you press the Authenticate button on the right hand side. Then, feel free to create, read, update and delete anything you want.

## License

The project is currently using the [MIT](https://choosealicense.com/licenses/mit/) license.
