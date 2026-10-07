import dotenv from 'dotenv';
import { createApp } from './app';

dotenv.config();

const PORT = Number(process.env.PORT ?? 3000);
const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://mongo:27017/backend-task';

async function bootstrap(): Promise<void> {
  const app = createApp();

  // TODO: connect mongoose + kafka here (left for next step)

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${PORT}`);
    console.log(`Mongo URI: ${MONGO_URI}`);
  });
}

void bootstrap();
