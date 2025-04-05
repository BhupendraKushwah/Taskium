import express from 'express';
const router = express.Router();
import { generateForgotPasswordToken, resetPassword } from '../controllers/settingController.js'
import CONSTANTS from "../config/constant.js";

router.post('/forgot-password', async (req, res) => {
    try {
        await generateForgotPasswordToken(req, res);
    } catch (error) {
        res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
})

router.post('/reset-password/:token', async (req, res) => {
    try {
        await resetPassword(req, res);
    } catch (error) {
        res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
})

export default router;