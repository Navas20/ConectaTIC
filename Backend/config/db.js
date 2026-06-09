import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: true,
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function initDb() {
  try {
    await pool.query('SELECT 1');
    console.log('✅ Conexión a MySQL establecida correctamente');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        correo VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        progreso INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Tabla usuarios verificada/creada');

    return pool;
  } catch (error) {
    console.error('❌ Error conectando a MySQL:', error.message);
    throw error;
  }
}

export function getDb() {
  return pool;
}

export default { initDb, getDb };