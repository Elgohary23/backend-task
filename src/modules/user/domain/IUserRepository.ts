// file:modules/user/domain/IUserRepository.ts
import { User } from './User';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findAll(): Promise<User[]>; // <-- إضافة دالة جلب الكل
  save(user: User): Promise<void>;
}