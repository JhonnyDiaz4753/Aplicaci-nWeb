// server.js
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'src'))); // tu carpeta del frontend

// API base externa
const API_BASE = 'http://3.145.104.62:8085/api/seminario';

// Proxy general GET
app.get('/api/:endpoint', async (req, res) => {
  try {
    const response = await fetch(`${API_BASE}/${req.params.endpoint}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al acceder a la API externa' });
  }
});

// Proxy para rutas específicas
app.get('/api/seminario/:subruta', async (req, res) => {
  try {
    const response = await fetch(`${API_BASE}/${req.params.subruta}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al acceder a la subruta' });
  }
});

// === Nuevas rutas POST hacia API externa ===

// Entrada de materia prima
app.post('/api/seminario/entradamateriaprima', async (req, res) => {
  try {
    const response = await fetch(`${API_BASE}/entradamateriaprima`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al enviar entrada de materia prima' });
  }
});

// Salida de materia prima
app.post('/api/seminario/salidamateriaprima', async (req, res) => {
  try {
    const response = await fetch(`${API_BASE}/salidamateriaprima`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al enviar salida de materia prima' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
