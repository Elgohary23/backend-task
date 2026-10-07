import { User } from '../domain/User';
import { IUserRepository } from '../domain/IUserRepository';
import { sendUserCreatedEvent } from '../infrastructure/kafka/producer';

export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string, email: string): Promise<User> {
    const existingUser = await this.userRepository.findById(id);
    if (existingUser) {
      throw new Error('User already exists');
    }
    const user = new User(id, email);
    user.changeEmail(email);
    await this.userRepository.save(user);

    try {
      await sendUserCreatedEvent({ id: user.id, email: user.email });
    } catch (error) {
      console.error('Failed to send user-created event to Kafka:', error);
    }

    return user;
  }
}