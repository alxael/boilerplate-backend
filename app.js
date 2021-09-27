const express = require('express');
const debug = require('debug')('app');
const morgan = require('morgan');
const chalk = require('chalk');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(morgan('tiny'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  debug(`Example app listening at http://localhost:${chalk.green(port)}`);
});
