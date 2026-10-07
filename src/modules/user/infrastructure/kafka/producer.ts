import kafka from './kafkaClient';

const producer = kafka.producer();

export async function connectProducer(): Promise<void> {
  await producer.connect();
}

export async function sendUserCreatedEvent(user: { id: string; email: string }): Promise<void> {
  await producer.send({
    topic: 'user-created',
    messages: [
      { value: JSON.stringify(user) },
    ],
  });
}