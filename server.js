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
  } catch (error) {
    console.error('Failed to initialize database schema:', error.message || error);
    process.exit(1);
  }
}

start();
