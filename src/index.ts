import dotenv from 'dotenv';
import mongoose from 'mongoose'; // <-- أضف هذا السطر
import { createApp } from './app';
import { connectProducer } from './modules/user/infrastructure/kafka/producer';
import { runConsumer } from './modules/user/infrastructure/kafka/consumer';

dotenv.config();

const PORT = Number(process.env.PORT ?? 3000);
const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://localhost:27017/backend-task';

async function bootstrap(): Promise<void> {
  const app = createApp();

  try {
    // الاتصال بـ MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB successfully.');

    await connectProducer();
    console.log('Kafka Producer connected.');
    
    await runConsumer();
    console.log('Kafka Consumer started.');
  } catch (error) {
    console.error('Failed to initialize services:', error);
  }

  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
    console.log(`Mongo URI: ${MONGO_URI}`);
  });
}

void bootstrap();