import express from 'express';
import { createUser, getUser, updateUser, disableUser, deleteUser } from '../controllers/user.controller.js';

const userRouter = express.Router();

userRouter.get('/:username', getUser);
userRouter.post('/', createUser);
userRouter.put('/:username', updateUser);
userRouter.patch('/:username/disable', disableUser);
userRouter.delete('/:username', deleteUser);

export default userRouter;