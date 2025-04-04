import express from 'express';
const router = express.Router();
import { createUser, loginUser } from '../controllers/authController.js'
import CONSTANTS from "../config/constant.js";

router.post('/signup', async (req, res) => {
    try {
        await createUser(req, res);
    } catch (error) {
        res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message || 'Internal server error' });
    }
})

router.post('/login', async (req, res) => {
    try {
        await loginUser(req, res);
    } catch (error) {
        res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
})


export default router;