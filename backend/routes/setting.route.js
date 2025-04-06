import express from 'express';
const router = express.Router();
import { generateForgotPasswordToken, resetPassword, getLoginDevices, getUserAttendances } from '../controllers/settingController.js'
import CONSTANTS from "../config/constant.js";
import { verifyToken } from '../middleware/authMiddleware.js';
import { deleteSessionByToken } from '../models/userModel.js';

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

router.get('/login-devices', verifyToken, async (req, res) => {
    try {
        await getLoginDevices(req, res);
    } catch (error) {
        res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
})

router.post('/logout', verifyToken, async (req, res) => {
    try {
        let result = await deleteSessionByToken(req.body.token);
        res.status(CONSTANTS.HTTP_STATUS.OK).json({
            success: true,
            data: result,
            message: 'Logout successful'
        });
    } catch (error) {
        res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
})

router.get('/attendance', verifyToken, async (req, res) => {
    try {
       await getUserAttendances(req, res);
    } catch (error) {
        res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
})
export default router;