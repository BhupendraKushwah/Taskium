import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import { getConnectionStatus } from './config/db.js'
import { uploadImage } from './utils/upload.js';
// uploadImage('https://imgs.search.brave.com/PwlDJFGIAdooeTnMSC7Qz5r6UuqZqHiHhtLeOtmXS1c/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/ZGlnaXRhbG9jZWFu/LmNvbS9hcGkvc3Rh/dGljLWNvbnRlbnQv/djEvaW1hZ2VzP3Ny/Yz0vX25leHQvc3Rh/dGljL21lZGlhL2lu/dHJvLXRvLWNsb3Vk/LmQ0OWJjNWY3Lmpw/ZWcmd2lkdGg9MTky/MA.jpeg','test')
const PORT = process.env.PORT || 3000;
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json())

getConnectionStatus();

app.use('/api',routes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});