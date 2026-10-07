// src/modules/user/domain/User.ts

export class User {
  constructor(
    public readonly id: string,
    public email: string
  ) {}

  public changeEmail(newEmail: string): void {
    if (!newEmail || !newEmail.includes('@')) {
      throw new Error('Invalid email format');
    }
    this.email = newEmail;
  }
}