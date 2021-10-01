const swaggerAutogen = require('swagger-autogen')();
const path = require('path');

const outputFile = path.join(__dirname, 'swagger.yaml');
const endpointFile = [ 
  path.join(__dirname, '../routes/*')
];

swaggerAutogen(outputFile, endpointFile);