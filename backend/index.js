import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import { getConnectionStatus } from './config/db.js'
import TableSeeds from './seeds/db.seeds.js';
const PORT = process.env.PORT || 3000;
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json())

getConnectionStatus();
TableSeeds();
app.use('/api',routes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});