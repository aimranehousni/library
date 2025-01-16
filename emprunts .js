// borrowing-service.js
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const app = express();
app.use(express.json());

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/bibliotheque', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Modèle d'emprunt
const Emprunt = mongoose.model('Emprunt', new mongoose.Schema({
  livreId: String,
  clientId: String,
  retourne: Boolean,
}));

// Emprunter un livre
app.post('/emprunts', async (req, res) => {
  const { livreId, clientId } = req.body;

  // Vérifier si le livre est disponible
  const livreResponse = await axios.get(`http://localhost:3001/livres/${livreId}`);
  if (!livreResponse.data.disponible) return res.status(400).send('Livre non disponible');

  // Vérifier si le client existe
  const clientResponse = await axios.get(`http://localhost:3002/clients/${clientId}`);
  if (!clientResponse.data) return res.status(404).send('Client non trouvé');

  // Créer un nouvel emprunt
  const emprunt = new Emprunt({ livreId, clientId, retourne: false });
  await emprunt.save();

  // Marquer le livre comme indisponible
  await axios.put(`http://localhost:3001/livres/${livreId}`, { disponible: false });

  res.status(201).json(emprunt);
});

// Retourner un livre
app.put('/emprunts/:id/retour', async (req, res) => {
  const emprunt = await Emprunt.findById(req.params.id);
  if (!emprunt) return res.status(404).send('Emprunt non trouvé');

  // Marquer le livre comme disponible
  await axios.put(`http://localhost:3001/livres/${emprunt.livreId}`, { disponible: true });

  // Marquer l'emprunt comme retourné
  emprunt.retourne = true;
  await emprunt.save();

  // Publier un événement (pour les notifications)
  await axios.post('http://localhost:3004/notifications', {
    message: `Livre ${emprunt.livreId} retourné par le client ${emprunt.clientId}`,
  });

  res.json(emprunt);
});

app.listen(3003, () => console.log('Service de Gestion des Emprunts en écoute sur le port 3003'));