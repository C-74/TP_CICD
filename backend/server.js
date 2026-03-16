const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// Configuration PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
});

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello World from Backend!' });
});

// Route pour vérifier la connexion à la BDD
app.get('/api/db-status', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    res.json({ message: 'Connecté à PostgreSQL avec succès !', time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ error: 'Erreur de connexion à la BDD', details: err.message });
  }
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
  });
}

module.exports = app;
