import { Router } from 'express';
import { createLink, redirectByCode } from '../controllers/link-controller.js';

export const apiRouter = Router();
apiRouter.post('/links', createLink);

export const redirectRouter = Router();
redirectRouter.get('/:code', redirectByCode);
