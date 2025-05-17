const express = require('express');
const { connectDB } = require('./config/database');
const routes = require('./routes');

// Crée l'application Express
const app = express();

// Middlewares
app.use(express.json()); // Parse les requêtes JSON
app.use(express.urlencoded({ extended: true })); // Parse les requêtes URL-encoded

// Monte les routes
app.use('/api', routes);

// Connexion à MongoDB
connectDB();

module.exports = app;