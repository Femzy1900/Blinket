import {Router} from 'express';
import { registerUserController, loginController, logoutController } from '../controller/user.controller.js';
import { auth } from '../middleware/auth.middleware.js';

const userRouter = Router();

userRouter.post('/register', registerUserController);
// userRouter.post('/verify-email', verifyEmailController)
userRouter.post('/login', loginController)
userRouter.get('logout', auth, logoutController)


export default userRouter;