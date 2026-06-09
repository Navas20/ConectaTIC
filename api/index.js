let app;

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
  initDb().catch(err => console.error('❌ DB init error:', err.message));
} catch (err) {
  console.error('❌ Failed to load config/db.js:', err.message);
}

export default app;
