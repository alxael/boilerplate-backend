# Boilerplate Back-End

This project is the back-end component of a product management web application.

## Features

At the moment, the API has very few endpoints.

## Technologies used

The project uses the following technologies to work:

- [NodeJS](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Swagger](https://swagger.io/tools/swagger-codegen/)

NodeJS is used to run the whole application. Express is used to provide server-side logic for the web application. MongoDB is used to handle the storage and management of the data. Swagger is used to document and interact manually with the API.

## Installation

MyLibrary requires [NodeJS](https://nodejs.org/en/) version 14 or newer to work and [MongoDB](https://www.mongodb.com/). First, clone the repository.

```console
https://github.com/alxael/boilerplate-backend.git
```

After this, install the packages with ```npm install```. Make sure you have MongoDB installed and set up properly to run locally. The application connects by default to ```mongodb://localhost:27017``` in the ```myapp``` database.

## Usage

First, start up the MongoDB server. If you are running it locally, open a new terminal and type in ```mongod```.

You will also need to add with ```touch .env``` the ```.env``` file, which should have the following structure:

```dosini
NODE_ENV=development
PORT=4000
DB_LINK=mongodb://localhost:27017/myapp
```

To run the project, simply do an ```npm run debug``` command. To interact with the API, access ```localhost:4000/api-docs```.

## License

The project is currently using the [MIT](https://choosealicense.com/licenses/mit/) license.
