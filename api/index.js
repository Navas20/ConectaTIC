let app;
let dbReady = false;
let dbError = null;

try {
  const serverModule = await import('../Backend/server.js');
  app = serverModule.default;
  console.log('✅ Backend/server.js loaded successfully');
} catch (err) {
  console.error('❌ Failed to load Backend/server.js:', err.message);
  console.error('Stack:', err.stack);
  const express = (await import('express')).default;
  app = express();
  app.get('*', (req, res) => {
    res.status(500).json({
      success: false,
      error: 'Server initialization failed',
      message: err.message,
    });
  });
}

try {
  const { initDb } = await import('../Backend/config/db.js');
  await initDb();
  dbReady = true;
  console.log('✅ Database initialized');
} catch (err) {
  dbError = err.message;
  console.error('❌ DB init error:', err.message);
}

app.use((req, res, next) => {
  if (!dbReady) {
    return res.status(503).json({
      success: false,
      message: 'Base de datos no disponible',
      error: dbError || 'Inicializando...',
    });
  }
  next();
});

export default app;
