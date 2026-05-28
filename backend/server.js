const { PORT } = require('./config/env');
const { ensureSchema } = require('./config/bootstrap');
const app = require('./app');

async function start() {
  try {
    await ensureSchema();
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\nPort ${PORT} is already in use.\nPlease close the other process using this port or change the PORT in config/env.js.\n`);
        process.exit(1);
      }

      throw err;
    });

    // Graceful Shutdown Handler
    const pool = require('./config/db');
    
    function shutdown(signal) {
      console.log(`\nReceived ${signal}. Starting graceful shutdown...`);
      server.close(async () => {
        console.log('HTTP server closed.');
        try {
          await pool.end();
          console.log('Database connection pool closed.');
          process.exit(0);
        } catch (err) {
          console.error('Error closing database pool:', err);
          process.exit(1);
        }
      });

      // Force exit after 10s if shutdown hangs
      setTimeout(() => {
        console.error('Graceful shutdown timed out. Forcing exit...');
        process.exit(1);
      }, 10000);
    }

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    console.error('Failed to initialize database schema:', error.message || error);
    process.exit(1);
  }
}

// Global Exception / Rejection Catchers to prevent server crash
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

start();
