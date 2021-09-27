const swaggerAutogen = require('swagger-autogen')();
const path = require('path');

const outputFile = path.join(__dirname, 'swagger.json');
const endpointFile = [ path.join(__dirname, '/routes/productRouter') ];

swaggerAutogen(outputFile, endpointFile);