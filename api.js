// api-gateway.js
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// Router les requêtes vers le service approprié
app.use('/livres', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `http://localhost:3001${req.url}`,
      data: req.body,
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || {});
  }
});

app.use('/clients', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `http://localhost:3002${req.url}`,
      data: req.body,
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || {});
  }
});

app.listen(3000, () => console.log('API Gateway en écoute sur le port 3000'));