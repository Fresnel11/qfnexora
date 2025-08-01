const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');
const routes = require('./routes');

// Crée l'application Express
const app = express();

// Configuration CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Middlewares
app.use(express.json()); // Parse les requêtes JSON
app.use(express.urlencoded({ extended: true })); // Parse les requêtes URL-encoded

// Monte les routes
app.use('/api', routes);

// Connexion à MongoDB
connectDB();

module.exports = app;