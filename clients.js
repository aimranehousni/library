// customer-service.js
const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/bibliotheque', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Modèle de client
const Client = mongoose.model('Client', new mongoose.Schema({
  nom: String,
  email: String,
}));

// Obtenir tous les clients
app.get('/clients', async (req, res) => {
  const clients = await Client.find();
  res.json(clients);
});

// Obtenir un client spécifique
app.get('/clients/:id', async (req, res) => {
  const client = await Client.findById(req.params.id);
  if (!client) return res.status(404).send('Client non trouvé');
  res.json(client);
});

// Ajouter un nouveau client
app.post('/clients', async (req, res) => {
  const client = new Client(req.body);
  await client.save();
  res.status(201).json(client);
});

// Mettre à jour un client
app.put('/clients/:id', async (req, res) => {
  const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!client) return res.status(404).send('Client non trouvé');
  res.json(client);
});

// Supprimer un client
app.delete('/clients/:id', async (req, res) => {
  const client = await Client.findByIdAndDelete(req.params.id);
  if (!client) return res.status(404).send('Client non trouvé');
  res.status(204).send();
});

app.listen(3002, () => console.log('Service de Gestion des Clients en écoute sur le port 3002'));