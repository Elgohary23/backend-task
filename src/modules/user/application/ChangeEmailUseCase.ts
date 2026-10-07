// src/modules/user/application/ChangeEmailUseCase.ts
import { IUserRepository } from '../domain/IUserRepository';

export class ChangeEmailUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string, newEmail: string): Promise<{ success: boolean; message: string }> {
    // 1. البحث عن المستخدم باستخدام العقد (IUserRepository) من غير ما نعرف هو متخزن فين
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // 2. تطبيق قواعد البيزنس الموجودة جوه الـ Domain Entity (User.ts)
    user.changeEmail(newEmail);

    // 3. حفظ التعديل في قاعدة البيانات
    await this.userRepository.save(user);

    return { success: true, message: 'Email updated successfully' };
  }
}