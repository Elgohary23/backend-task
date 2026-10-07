// file:modules/user/application/ListUsersUseCase.ts
import { User } from '../domain/User';
import { IUserRepository } from '../domain/IUserRepository';

export class ListUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(): Promise<User[]> {
    return await this.userRepository.findAll();
  }
}