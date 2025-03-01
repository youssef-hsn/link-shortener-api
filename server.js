import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './utils/db.js';

dotenv.config();

const app = express();

app.get('/test', (req, res) => {
    res.json({ message: 'Website is up and running' });
})

app.listen(3000, () => {
    connectDB();
    console.log('Server is running on port 3000');
})