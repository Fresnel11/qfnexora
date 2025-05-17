const dotenv = require('dotenv');
dotenv.config();
const app = require('./app');

// Charge les variables d'environnement

const PORT = process.env.PORT || 3000;

// Lance le serveur
app.listen(PORT, () => {
  console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});