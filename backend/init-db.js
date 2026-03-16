require('dotenv').config(); // Gère les variables d'environnement locales si besoin
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

async function initDB() {
  const client = await pool.connect();
  try {
    console.log('🐘 Connexion réussie à PostgreSQL...');
    
    console.log('🔨 Création de la table "users"...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('📝 Insertion de données bidons...');
    await client.query(`
      INSERT INTO users (name, email)
      VALUES 
        ('Alice Dupont', 'alice.dupont@example.com'),
        ('Bob Martin', 'bob.martin@example.com')
      ON CONFLICT (email) DO NOTHING; -- Évite les erreurs si le script est lancé deux fois
    `);
    
    console.log('✅ Données insérées avec succès !');

    // Petite vérification pour afficher les données
    const res = await client.query('SELECT * FROM users');
    console.log('📊 Contenu actuel de la table :', res.rows);

  } catch (err) {
    console.error('❌ Erreur lors du script :', err);
  } finally {
    client.release();
    pool.end(); // Ferme la connexion proprement
  }
}

initDB();
