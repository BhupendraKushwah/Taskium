import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import { getConnectionStatus } from './db.js'
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json())

getConnectionStatus();

app.get('/api', (req, res) => {
    res.send("Hello World")
})
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});