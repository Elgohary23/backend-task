import express, { type Application, type Request, type Response } from 'express';
import userRoutes from './modules/user/api/userRoutes';

export function createApp(): Application {
  const app = express();

  app.use(express.json());

  // Register user routes
  app.use('/users', userRoutes);

  app.get('/', (_req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'backend-task' });
  });

  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'up' });
  });

  return app;
}
