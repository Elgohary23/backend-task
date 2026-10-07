// file:modules/user/application/GetUserUseCase.ts
import { User } from '../domain/User';
import { IUserRepository } from '../domain/IUserRepository';

export class GetUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}