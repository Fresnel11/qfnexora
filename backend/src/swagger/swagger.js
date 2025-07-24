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
        Transaction: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['deposit', 'withdrawal', 'transfer'] },
            amount: { type: 'number' },
            category: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['pending', 'success', 'failed'] },
            currency: { type: 'string' },
            date: { type: 'string', format: 'date' },
            source: { type: 'string', enum: ['manual', 'future_integration'] },
            relatedSavingPlan: { type: 'string' },
            receiptUrl: { type: 'string' },
            nature: { type: 'string', enum: ['income', 'expense'] },
          },
          required: ['type', 'amount', 'nature'],
        },
        Budget: {
          type: 'object',
          properties: {
            period: { type: 'string', enum: ['weekly', 'monthly', 'yearly'] },
            amount: { type: 'number' },
            category: { type: 'string' },
            startDate: { type: 'string', format: 'date' },
            endDate: { type: 'string', format: 'date' },
            currency: { type: 'string' },
            status: { type: 'string', enum: ['active', 'expired', 'cancelled'] },
            notifications: { type: 'boolean' },
          },
          required: ['period', 'amount', 'startDate', 'endDate'],
        },
      },
    },
  },
  apis: ['./src/routes/*.js'], // Chemin vers vos fichiers de routes
};

const specs = swaggerJsdoc(options);

module.exports = specs;
