require("dotenv").config();
const express = require('express');
const router = express.Router();
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


const swaggerDefinition = {
    openapi: '3.1.0',
    info: {
      title: 'MailFile',
      version: '1.0.0',
      description:
        'This is a REST API application for MailFile.',
      license: {
        name: 'Licensed Under MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
        description: 'Development server',
      },
    ],
  };

const options = {
    swaggerDefinition,
    apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);
router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

module.exports = router;