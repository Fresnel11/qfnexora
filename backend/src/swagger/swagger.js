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
        url: 'http://localhost:3000/api', // Correction ici
        description: 'Serveur de développement',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        SavingPlan: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            targetAmount: { type: 'number' },
            startDate: { type: 'string', format: 'date' },
            endDate: { type: 'string', format: 'date' },
            autoSave: { type: 'boolean' },
            frequency: { type: 'string', enum: ['daily', 'weekly', 'monthly'] },
            currency: { type: 'string' },
            IFU: { type: 'string' },
          },
          required: ['title', 'targetAmount', 'startDate', 'endDate'],
        },
        SavingPlanDeposit: {
          type: 'object',
          properties: {
            amount: { type: 'number' },
            note: { type: 'string' },
          },
          required: ['amount'],
        },
      },
    },
  },
  apis: ['./src/routes/*.js'], // Chemin vers vos fichiers de routes
};

const specs = swaggerJsdoc(options);

module.exports = specs;
