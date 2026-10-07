import { Router } from 'express';
import { MongoUserRepository } from '../infrastructure/MongoUserRepository'; // <-- استخدم الـ Mongo Repo
import { ChangeEmailUseCase } from '../application/ChangeEmailUseCase';
import { CreateUserUseCase } from '../application/CreateUserUseCase';
import { GetUserUseCase } from '../application/GetUserUseCase';
import { ListUsersUseCase } from '../application/ListUsersUseCase';
import { UserController } from './userController';

const router = Router();

const userRepository = new MongoUserRepository(); // <-- هنا التعديل

const changeEmailUseCase = new ChangeEmailUseCase(userRepository);
const createUserUseCase = new CreateUserUseCase(userRepository);
const getUserUseCase = new GetUserUseCase(userRepository);
const listUsersUseCase = new ListUsersUseCase(userRepository);

const userController = new UserController(
  changeEmailUseCase,
  createUserUseCase,
  getUserUseCase,
  listUsersUseCase
);

router.post('/', (req, res) => {
  void userController.createUser(req, res);
});

router.get('/', (req, res) => {
  void userController.listUsers(req, res);
});

router.get('/:userId', (req, res) => {
  void userController.getUserById(req, res);
});

router.patch('/:userId/email', (req, res) => {
  void userController.changeEmail(req, res);
});

export default router;