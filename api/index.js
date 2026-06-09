import app from '../Backend/server.js';
import { initDb } from '../Backend/config/db.js';

// Inicializar BD en cada cold start (idempotente)
initDb().catch(err => console.error('DB init error:', err));

export default app;
