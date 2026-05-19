import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', 'conectatic.db');

let db;

export async function initDb() {
  const SQL = await initSqlJs();
  
  let data;
  if (fs.existsSync(dbPath)) {
    data = fs.readFileSync(dbPath);
  }
  
  db = new SQL.Database(data);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      correo TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      progreso INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  saveDb();
  
  console.log('✅ Conexión a SQLite establecida correctamente');
  console.log('   Base de datos:', dbPath);
  
  return db;
}

export function saveDb() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
}

export function getDb() {
  return db;
}

export default { initDb, getDb, saveDb };