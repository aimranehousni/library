// book-service.js
const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/bibliotheque', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Modèle de livre
const Livre = mongoose.model('Livre', new mongoose.Schema({
  titre: String,
  auteur: String,
  disponible: Boolean,
}));

// Obtenir tous les livres
app.get('/livres', async (req, res) => {
  const livres = await Livre.find();
  res.json(livres);
});

// Obtenir un livre spécifique
app.get('/livres/:id', async (req, res) => {
  const livre = await Livre.findById(req.params.id);
  if (!livre) return res.status(404).send('Livre non trouvé');
  res.json(livre);
});

// Ajouter un nouveau livre
app.post('/livres', async (req, res) => {
  const livre = new Livre({ ...req.body, disponible: true });
  await livre.save();
  res.status(201).json(livre);
});

// Mettre à jour un livre
app.put('/livres/:id', async (req, res) => {
  const livre = await Livre.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!livre) return res.status(404).send('Livre non trouvé');
  res.json(livre);
});

// Supprimer un livre
app.delete('/livres/:id', async (req, res) => {
  const livre = await Livre.findByIdAndDelete(req.params.id);
  if (!livre) return res.status(404).send('Livre non trouvé');
  res.status(204).send();
});

app.listen(3001, () => console.log('Service de Gestion des Livres en écoute sur le port 3001'));