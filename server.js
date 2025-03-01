import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './utils/db.js';
import { redirectMe } from './controllers/alias.controller.js';
import aliasRouter from './routes/alias.route.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/test', (req, res) => {
    res.json({ message: 'Website is up and running' });
})

app.get('/:alias', redirectMe);
app.use('/alias/', aliasRouter);

app.listen(3000, () => {
    connectDB();
    console.log('Server is running on port 3000');
})