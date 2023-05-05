import * as userController from '~/controller/user.controller';
import { Router } from 'express';

export const userRouter = Router();

userRouter.post("/register", userController.register);
userRouter.post("/login",userController.login);


