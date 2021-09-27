const express = require('express');
const debug = require('debug')('app');
const morgan = require('morgan');
const chalk = require('chalk');
const path = require('path');
const mongoose = require('mongoose');
const swaggerUI = require('swagger-ui-express');

const port = process.env.PORT || 8080;

if(process.env.ENV == 'development') {
  const db = mongoose.connect('mongodb://localhost:27017/myapp');
  debug(`This ${chalk.green('is')} a test.`);
} else if(process.env.ENV == 'production') {
  const db = mongoose.connect('');
  debug(`This ${chalk.red('is not')} a test.`);
}

const app = express();
const productModel = require(path.join(__dirname, '/models/productModel'));
const productRouter = require(path.join(__dirname, '/routes/productRouter'))(productModel);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(morgan('tiny'));

const swaggerDocument = require(path.join(__dirname, '/swagger.json'));

app.use('/api', productRouter);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.listen(port, () => {
  debug(`Listening on port ${chalk.green(port)}.`);
});

require(path.join(__dirname, '/controllers/productController'))(app);