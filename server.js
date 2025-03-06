import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './utils/db.js';
import { redirectMe } from './controllers/alias.controller.js';
import aliasRouter from './routes/alias.router.js';
import userRouter from './routes/user.router.js';
import authRouter from './routes/auth.router.js';
import { requireAuth, requireAdmin } from './utils/middleware.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/test', (req, res) => {
    res.json({ message: 'Website is up and running' });
})

app.get('/:alias', redirectMe);
app.use('/api/alias/', requireAuth, aliasRouter);
app.use('/api/user/', requireAuth, requireAdmin, userRouter);
app.use('/api/auth/', authRouter);

app.listen(3000, () => {
    connectDB();
    console.log('Server is running on port 3000');
})