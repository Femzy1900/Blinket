import {Router} from 'express';
import { registerUserController } from '../controller/user.controller.js';

const userRouter = Router();

userRouter.post('/register', registerUserController);

export default userRouter;