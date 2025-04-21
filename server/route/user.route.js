import {Router} from 'express';
import { registerUserController, loginController, logoutController, uploadAvatar } from '../controller/user.controller.js';
import { auth } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const userRouter = Router();

userRouter.post('/register', registerUserController);
// userRouter.post('/verify-email', verifyEmailController)
userRouter.post('/login', loginController)
userRouter.get('logout', auth, logoutController)
userRouter.put('upload-avatar', auth, upload.single('avatar'), uploadAvatar  )


export default userRouter;