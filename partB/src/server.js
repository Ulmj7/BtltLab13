import { app } from './app.js';
import { env } from './config/env.js';
import { pool } from './db/pool.js';

const server = app.listen(env.port, () => {
  console.log(`[server] listening on ${env.baseUrl} (env=${env.nodeEnv})`);
});

async function shutdown(signal) {
  console.log(`[server] ${signal} received, draining...`);
  server.close(async (err) => {
    if (err) {
      console.error('[server] close error', err);
      process.exit(1);
    }
    try {
      await pool.end();
      console.log('[server] db pool closed');
      process.exit(0);
    } catch (poolErr) {
      console.error('[server] pool drain error', poolErr);
      process.exit(1);
    }
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
