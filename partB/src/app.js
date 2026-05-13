import express from 'express';
import helmet from 'helmet';
import { apiRouter, redirectRouter } from './routes/link-routes.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(express.json({ limit: '16kb' }));

  app.get('/healthz', (req, res) => res.json({ status: 'ok' }));

  app.use('/api', apiRouter);
  app.use('/', redirectRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export const app = createApp();
