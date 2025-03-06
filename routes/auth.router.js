import express from 'express';
import { register, login, me, updateMe } from '../controllers/auth.controller.js';
import { requireAuth } from '../utils/middleware.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/me', requireAuth, me);
authRouter.put('/me', requireAuth, updateMe);

export default authRouter;