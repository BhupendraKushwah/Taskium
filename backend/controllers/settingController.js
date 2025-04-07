import CONSTANTS from '../config/constant.js';
import pool from '../config/db.js';
import logger from '../config/logger.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { checkEmailExists } from '../models/userModel.js'
import bcrypt from 'bcrypt';
import { sendPasswordResetLink } from '../services/emailService.js';
import { getUserAttendance } from '../models/attendanceModel.js';
import { getNotifications, markNotificationAsRead } from '../models/notificationModel.js';
dotenv.config();
const generateForgotPasswordToken = async (req, res) => {
    try {
        let { email } = req.body;
        let isUserExists = await checkEmailExists(email);
        if (!isUserExists) return res.status(CONSTANTS.HTTP_STATUS.UNAUTHORIZED).json({ error: 'User does not exist' })

        let token = jwt.sign({ email }, process.env.JWT_TOKEN, { expiresIn: '10min' });

        let query = `UPDATE users SET passwordResetToken = ? WHERE email = ?`;
        let values = [token, email];
        let [row] = await pool.query(query, values);

        let nameQuery = `SELECT username FROM users WHERE email = ?`;
        let nameValues = [email];
        let [nameRow] = await pool.query(nameQuery, nameValues);
        if (row.length) return res.status(CONSTANTS.HTTP_STATUS.FORBIDDEN).json({ error: 'An error occurred' })
        let info = await sendPasswordResetLink(email, nameRow[0].username, `http://localhost:5173/forgot-password/${token}`)
        res.status(CONSTANTS.HTTP_STATUS.OK).json({
            success: true,
            data: {
                token
            },
            message: 'Token generated successfully'
        })
    } catch (error) {
        logger.Error(error, { filepath: '/controllers/settingController.js', function: 'generateForgotPasswordToken' });
        throw error;
    }
}

const resetPassword = async (req, res) => {
    try {
        let { token, newPassword } = req.body;
        let query = `SELECT * FROM users WHERE passwordResetToken = ?`;
        let values = [token];
        let [row] = await pool.query(query, values);
        if (!row.length) return res.status(CONSTANTS.HTTP_STATUS.UNAUTHORIZED).json({ error: 'Invalid token' })

        let decodeToken = jwt.decode(token);
        let isExpire = decodeToken.exp < Math.floor(Date.now() / 1000);
        if (isExpire) return res.status(CONSTANTS.HTTP_STATUS.UNAUTHORIZED).json({ error: 'Token expired' })

        let hashedPassword = await bcrypt.hash(newPassword, 10);

        query = `UPDATE users SET password = ? WHERE email = ?`;
        let resetValues = [hashedPassword, decodeToken.email];
        let [result] = await pool.query(query, resetValues);
        if (!result.affectedRows) return res.status(CONSTANTS.HTTP_STATUS.FORBIDDEN).json({ error: 'An error occurred' })

        let deleteQuery = `UPDATE users SET passwordResetToken = ? WHERE email = ?`;
        let deleteValues = [null, decodeToken.email];
        let [deleteResult] = await pool.query(deleteQuery, deleteValues);
        if (!deleteResult.affectedRows) return res.status(CONSTANTS.HTTP_STATUS.FORBIDDEN).json({ error: 'An error occurred' })
        res.status(CONSTANTS.HTTP_STATUS.OK).json({
            success: true,
            data: {
                token
            },
            message: 'Password reset successfully'
        })
    } catch (error) {
        logger.Error(error, { filepath: '/controllers/settingController.js', function: 'resetPassword' });
        throw error;
    }
}

const getLoginDevices = async (req, res) => {
    try {
        let userId = req.userId;
        let query = `SELECT * FROM userDeviceLogins WHERE userId = ? ORDER BY createdAt DESC`;
        let values = [userId];
        let [row] = await pool.query(query, values);
        res.status(CONSTANTS.HTTP_STATUS.OK).json({
            success: true,
            data: row,
            message: 'Login devices fetched successfully'
        })
    } catch (error) {
        logger.Error(error, { filepath: '/controllers/settingController.js', function: 'getLoginDevices' });
        throw error;
    }
}


const getUserAttendances = async (req, res) => {
    try {
        let userId = req.userId;
        const { success, data, message, count } = await getUserAttendance(userId)

        if (!success) return res.status(CONSTANTS.HTTP_STATUS.FORBIDDEN).json({ error: 'An error occurred' })
        if (data.length === 0) return res.status(CONSTANTS.HTTP_STATUS.NOT_FOUND).json({ error: 'No attendance found' })

        let userAttendance = data.reduce((acc, item) => {
            if (item.status === 'PRESENT') {
                acc[item.date] = item.status;
            }
            return acc;
        }, {});
        res.status(CONSTANTS.HTTP_STATUS.OK).json({
            success,
            userAttendance: userAttendance,
            message,
            count
        })
    } catch (error) {
        logger.Error(error, { filepath: '/controllers/settingController.js', function: 'getUserAttendance' });
        throw error;
    }
}

const getUserNotifications = async (req, res) => {
    try {
        let userId = req.userId;
        let { success, data, message, count } = await getNotifications(userId, req.query.params);
        res.status(CONSTANTS.HTTP_STATUS.OK).json({
            success,
            data,
            message,
            count
        })
    } catch (error) {
        logger.Error(error, { filepath: '/controllers/settingController.js', function: 'getNotifications' });
        throw error;
    }
}

const markAllAsRead = async (req, res) => {
    try {
        const userId = req.userId;
        await markNotificationAsRead(userId, null, true);
        res.status(CONSTANTS.HTTP_STATUS.OK).json({
            success: true,
            message: 'All notifications marked as read'
        })
    } catch (error) {
        logger.Error(error, { filepath: '/controllers/settingController.js', function: 'markAllAsRead' });
        throw error;
    }
}

export {
    generateForgotPasswordToken,
    resetPassword,
    getLoginDevices,
    getUserAttendances,
    getUserNotifications,
    markAllAsRead
}