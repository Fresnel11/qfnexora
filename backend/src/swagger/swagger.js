const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Quantum Finance API Documentation',
      version: '1.0.0',
      description: 'Documentation API pour Quantum Finance',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Chemin vers vos fichiers de routes
};

const specs = swaggerJsdoc(options);

module.exports = specs;
