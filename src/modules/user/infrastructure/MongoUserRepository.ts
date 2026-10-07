import { User } from '../domain/User';
import { IUserRepository } from '../domain/IUserRepository';
import { UserModel } from './presistance/UserModel';

export class MongoUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findOne({ id });
    if (!doc) return null;
    return new User(doc.id, doc.email);
  }

  async findAll(): Promise<User[]> {
    const docs = await UserModel.find();
    return docs.map(doc => new User(doc.id, doc.email));
  }

  async save(user: User): Promise<void> { // <-- غيرناها هنا لـ Promise<void>
    await UserModel.findOneAndUpdate(
      { id: user.id },
      { id: user.id, email: user.email },
      { upsert: true, new: true }
    );
  }
}