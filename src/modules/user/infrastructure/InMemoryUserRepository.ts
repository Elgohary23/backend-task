// file:modules/user/infrastructure/InMemoryUserRepository.ts
import { User } from '../domain/User';
import { IUserRepository } from '../domain/IUserRepository';

export class InMemoryUserRepository implements IUserRepository {
  private users: Map<string, User> = new Map([
    ['1', new User('1', 'old@example.com')]
  ]);

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async findAll(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async save(user: User): Promise<void> {
    this.users.set(user.id, user);
  }
}