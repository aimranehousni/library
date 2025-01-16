// notification-service.js
const express = require('express');
const app = express();
app.use(express.json());

// Envoyer une notification
app.post('/notifications', (req, res) => {
  const { message } = req.body;
  console.log(`Notification envoyée : ${message}`);
  res.status(201).json({ message: 'Notification envoyée avec succès' });
});

app.listen(3004, () => console.log('Service de Notification en écoute sur le port 3004'));