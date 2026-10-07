import { Schema, model, Document } from 'mongoose';

export interface IUserDocument extends Document {
  id: string;
  email: string;
}

const UserSchema = new Schema<IUserDocument>({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true }
});

export const UserModel = model<IUserDocument>('User', UserSchema);