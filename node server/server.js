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
app.get('/api/seminario/materiaprima/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const response = await fetch(`${API_BASE}/entradamateriaprima`);
    if (!response.ok) return res.status(response.status).json({ error: 'Error al obtener lista' });

    const lista = await response.json();
    const registro = lista.find(item => item.id === parseInt(id));

    if (!registro) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }

    res.json(registro);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno al procesar la solicitud' });
  }
});

app.post('/api/seminario/entradamateriaprima/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const response = await fetch(`${API_BASE}/entradamateriaprima/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al enviar entrada de materia prima con ID' });
  }
});
// Obtener una entrada de materia prima por ID
app.get('/api/seminario/entradamateriaprima/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const response = await fetch(`${API_BASE}/entradamateriaprima`);
    if (!response.ok) return res.status(response.status).json({ error: 'Error al obtener lista' });

    const lista = await response.json();
    const registro = lista.find(item => item.id === parseInt(id));

    if (!registro) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }

    res.json(registro);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno al procesar la solicitud' });
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

// Obtener una salida de materia prima por ID
app.get('/api/seminario/salidamateriaprima/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const response = await fetch(`${API_BASE}/salidamateriaprima`);
    if (!response.ok) return res.status(response.status).json({ error: 'Error al obtener lista' });

    const lista = await response.json();
    const registro = lista.find(item => item.id === parseInt(id));

    if (!registro) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }

    res.json(registro);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno al procesar la solicitud' });
  }
});
// actualizar stock de materia prima
app.put('/api/seminario/materiaprima', async (req, res) => {
  try {
    const response = await fetch(`${API_BASE}/materiaprima`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar stock de materia prima' });
  }
});

// Eliminar entrada de entrada o salida de materia prima
app.delete('/api/seminario/entradamateriaprima/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const response = await fetch(`${API_BASE}/entradamateriaprima/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) return res.status(response.status).json({ error: 'Error al eliminar entrada' });

    res.json({ message: 'Entrada eliminada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno al procesar la solicitud' });
  }
});
app.delete('/api/seminario/salidamateriaprima/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const response = await fetch(`${API_BASE}/salidamateriaprima/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) return res.status(response.status).json({ error: 'Error al eliminar salida' });

    res.json({ message: 'Salida eliminada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno al procesar la solicitud' });
  }
});


// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
