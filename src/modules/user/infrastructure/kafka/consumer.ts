import kafka from './kafkaClient';

const consumer = kafka.consumer({ groupId: 'user-service-group' });

export async function runConsumer(): Promise<void> {
  await consumer.connect();
  await consumer.subscribe({ topic: 'user-created', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const user = JSON.parse(message.value?.toString() ?? '{}');
      console.log(`[Kafka Consumer] User created event received:`, user);
    },
  });
}