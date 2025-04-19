import {Router} from 'express';
import { registerUserController } from '../controller/user.controller';

const userRouter = Router();

userRouter.post('/register', registerUserController);

export default userRouter;