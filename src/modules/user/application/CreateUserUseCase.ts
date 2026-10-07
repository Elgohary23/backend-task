// file:modules/user/application/CreateUserUseCase.ts
import { User } from '../domain/User';
import { IUserRepository } from '../domain/IUserRepository';

export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string, email: string): Promise<User> {
    const existingUser = await this.userRepository.findById(id);
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    // استخدام فحص الـ email الموجود في الكلاس الأصلي
    const user = new User(id, email);
    user.changeEmail(email); // هيعمل validation للإيميل
    
    await this.userRepository.save(user);
    return user;
  }
}