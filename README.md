# Boilerplate Back-End

This project is a RESTful API designed for the management of an online shop.

## Technologies used

The project uses the following technologies to work:

- [NodeJS](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Swagger](https://swagger.io/tools/swagger-codegen/)
- [Azure DevOps](https://azure.microsoft.com/en-us/services/devops/)

## Features

At the moment, the API has endpoints for products, users and user roles. The API uses JWT to sign claims securely.

NodeJS is used to run the whole application. Express is used to provide server-side logic for the web application. MongoDB is used to handle the storage and management of the data. Swagger is used to document and interact manually with the API. Azure DevOps is used with agile methodologies to ensure a smooth development process.

## Installation

### Step 1

The API requires [NodeJS](https://nodejs.org/en/) version 14 or newer to work and [MongoDB](https://www.mongodb.com/). Ensure these techonlogies are installed.

### Step 2

Clone the repository.

```console
git clone https://github.com/alxael/boilerplate-backend.git
```

### Step 3

Enter the directory in which the repository was cloned. Install the packages with ```npm install```. Then, add a ```.env``` file by running the ```touch .env``` command. This file should have the following structure:

```dosini
NODE_ENV=development
PORT=4000
DB_LINK=mongodb://localhost:27017/myapp
TOKEN_KEY=*random text*
SIGNUP_ROLE=client
```

### Step 4

Open a terminal window and start the MongoDB server by running the ```mongod``` command. In a separate terminal window, open the Mongo CLI by running the ```mongo``` command. Then run the ```show dbs``` command to view all databases. Now, run the ```use myapp``` command.

### Step 5

Now run the following command:

```javascript
db.userroles.insert(
  [
    {userRole: "client"},
    {userRole: "moderator"},
    {userRole: "administrator"}
  ]
)
```

This will create the user roles, which upon running the ```db.userroles.find().pretty()``` command should look similar to the following:

```json
{ 
    "_id" : ObjectId("6156be0456c08eccd629c6f8"),
    "userRole" : "client"
    }
{
    "_id" : ObjectId("6156be0456c08eccd629c6f9"),
    "userRole" : "moderator" 
}
{
    "_id" : ObjectId("6156be0456c08eccd629c6fa"),
    "userRole" : "administrator"
}
```

### Step 6

Now, in the application files, modify the ```SIGNUP_ROLE``` environment variable to ```administrator``` or ```moderator``` and create an account with those permissions. Make sure to change the environment variable back to ```client``` after finishing this initial process.

### Step 7

Sign in into an administrator account to use the whole application. Use the ```POST /user/login``` endpoint to log in. After login, you will be granted a JWT token. Copy said token into the window that pops up when you press the ```Authorize``` button, in the right hand side. Keep this token saved somewhere and update it every time you log in, as you will need it to use most of the endpoints of the API.

Congratulations! You are now all set up to use the API.

## License

The project is currently using the [MIT](https://choosealicense.com/licenses/mit/) license.
