// payment-service.js
const express = require('express');
const app = express();
app.use(express.json());

// Traiter un paiement
app.post('/paiements', (req, res) => {
  const { montant, clientId } = req.body;
  console.log(`Paiement de ${montant} traité pour le client ${clientId}`);
  res.status(201).json({ message: 'Paiement traité avec succès' });
});

app.listen(3005, () => console.log('Service de Paiement en écoute sur le port 3005'));