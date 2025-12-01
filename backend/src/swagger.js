const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'OMIND Prototype API', version: '1.0.0' }
  },
  apis: []
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerUi.setup(swaggerSpec);
