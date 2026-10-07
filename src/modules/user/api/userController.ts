// file:modules/user/api/userController.ts
import { Request, Response } from 'express';
import { ChangeEmailUseCase } from '../application/ChangeEmailUseCase';
import { CreateUserUseCase } from '../application/CreateUserUseCase';
import { GetUserUseCase } from '../application/GetUserUseCase';
import { ListUsersUseCase } from '../application/ListUsersUseCase';

export class UserController {
  constructor(
    private readonly changeEmailUseCase: ChangeEmailUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase
  ) {}

  async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const { id, email } = req.body;
      const user = await this.createUserUseCase.execute(id, email);
      return res.status(201).json(user);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getUserById(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.params;
      const user = await this.getUserUseCase.execute(userId);
      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

  async listUsers(_req: Request, res: Response): Promise<Response> {
    try {
      const users = await this.listUsersUseCase.execute();
      return res.status(200).json(users);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async changeEmail(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.params;
      const { email } = req.body;
      const result = await this.changeEmailUseCase.execute(userId, email);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}