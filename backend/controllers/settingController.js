const CONSTANTS = require('../config/constant');
const logger = require('../config/logger');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userDao = require('../dao/user.dao')
const { sendPasswordResetLink } = require('../services/emailService');
const attendanceDao = require('../dao/attendance.dao');
const notificationDao = require('../dao/notification.dao');
const userDeviceDao = require('../dao/userLoginDevices.dao');
const { getConnection } = require('../config/db');
const { checkEmailExists } = require('../services/userService');
const { Op } = require('sequelize');
require('dotenv').config();
const generateForgotPasswordToken = async (req) => {
    try {
        const { email } = req.body;
        const { models } = await getConnection();

        const isUserExists = await checkEmailExists(email);
        if (!isUserExists) {
            return {
                status: CONSTANTS.HTTP_STATUS.UNAUTHORIZED,
                message: 'User does not exist'
            };
        }

        const token = jwt.sign({ email }, process.env.JWT_TOKEN, { expiresIn: '10min' });

        const updateResult = await userDao.updateUser(models, { email }, { passwordResetToken: token });
        if (!updateResult || (Array.isArray(updateResult) && updateResult.length === 0)) {
            return {
                status: CONSTANTS.HTTP_STATUS.FORBIDDEN,
                message: 'An error occurred'
            };
        }

        const user = await userDao.getUserByCondition(models, { email });
        const username = Array.isArray(user) ? user[0]?.username : user?.username;

        await sendPasswordResetLink(email, username, `http://localhost:5173/forgot-password/${token}`);

        return {
            status: CONSTANTS.HTTP_STATUS.OK,
            success: true,
            data: {
                token
            },
            message: 'Token generated successfully'
        };
    } catch (error) {
        console.log(error);
        logger.Error(error, {
            filepath: '/controllers/settingController.js',
            function: 'generateForgotPasswordToken'
        });
        throw error;
    }
};

const resetPassword = async (req) => {
    try {
        let { token, newPassword } = req.body;
        let { models } = await getConnection();
        let user = await userDao.getUserByCondition(models, { passwordResetToken: token });
        if (!user) return { status: CONSTANTS.HTTP_STATUS.UNAUTHORIZED, error: 'Invalid token' }

        let decodeToken = jwt.decode(token);
        let isExpire = decodeToken.exp < Math.floor(Date.now() / 1000);
        if (isExpire) return { status: CONSTANTS.HTTP_STATUS.UNAUTHORIZED, error: 'Token expired' }

        let hashedPassword = await bcrypt.hash(newPassword, 10);

        let updateUser = await userDao.updateUser(models, { email: decodeToken.email }, { passwordResetToken: null, password: hashedPassword });

        if (!updateUser) return { status: CONSTANTS.HTTP_STATUS.FORBIDDEN, error: 'An error occurred' }
        return { status: CONSTANTS.HTTP_STATUS.OK, success: true, message: 'Password reset successfully' }

    } catch (error) {
        logger.Error(error, { filepath: '/controllers/settingController.js', function: 'resetPassword' });
        throw error;
    }
}

const getLoginDevices = async (req) => {
    try {
        let userId = req.userId;
        let { models } = await getConnection();
        let result = await userDeviceDao.getLoginDevices(models, {
            userId,
        })
        return {
            status: CONSTANTS.HTTP_STATUS.OK,
            success: true,
            data: result,
            message: 'Login devices fetched successfully'
        }
    } catch (error) {
        logger.Error(error, { filepath: '/controllers/settingController.js', function: 'getLoginDevices' });
        throw error;
    }
}

const getUserAttendances = async (req) => {
    try {
        let userId = req.userId;
        const { models } = await getConnection();
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        const { rows, count } = await attendanceDao.getUserAttendance(models, {
        userId,
        createdAt: {
            [Op.between]: [startOfMonth, endOfMonth]
        }
        });

        if (!rows.length) return { status: CONSTANTS.HTTP_STATUS.NOT_FOUND, message: 'No attendance found' }

        let userAttendance = rows.reduce((acc, item) => {
            if (item.status === 'PRESENT') {
                acc[item.date] = item.status;
            }
            return acc;
        }, {});
        
        return {
            status: CONSTANTS.HTTP_STATUS.OK,
            success: true,
            userAttendance: userAttendance,
            count
        }
    } catch (error) {
        logger.Error(error, { filepath: '/controllers/settingController.js', function: 'getUserAttendance' });
        throw error;
    }
}

const getUserNotifications = async (req) => {
    try {
        let userId = req.userId;
        let { models } = await getConnection();
        const { limit, offset } = req.query
        let { rows, count } = await notificationDao.getNotifications(models, { userId }, limit, offset);

        return {
            status: CONSTANTS.HTTP_STATUS.OK,
            success: true,
            message: 'Notifications fetched successfully',
            count,
            data: rows
        }
    } catch (error) {
        logger.Error(error, { filepath: '/controllers/settingController.js', function: 'getNotifications' });
        return {
            status: CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR,
            error: 'Internal server error'
        }
    }
}

const markAllAsRead = async (req) => {
    try {
        const userId = req.userId;
        const { models } = await getConnection();
        await notificationDao.markNotificationAsRead(models, { userId }, {
            isRead: 1
        });
        return {
            status: CONSTANTS.HTTP_STATUS.OK,
            success: true,
            message: 'All notifications marked as read'
        }
    } catch (error) {
        logger.Error(error, { filepath: '/controllers/settingController.js', function: 'markAllAsRead' });
        throw error;
    }
}

const getNotificationsCount = async (req) => {
    try {
        let userId = req.userId;
        let { models } = await getConnection();
        const { limit, offset } = req.query
        let { rows, count } = await notificationDao.getNotifications(models, { userId, isRead: 0 }, limit, offset);

        return {
            status: CONSTANTS.HTTP_STATUS.OK,
            success: true,
            message: 'Notifications fetched successfully',
            count,
            data: rows
        }
    } catch (error) {
        logger.Error(error, { filepath: '/controllers/settingController.js', function: 'getNotificationsCount' });
        throw error;
    }
}

const getProjectUsers = async (req, res) => {
    try {
        let { models } = await getConnection();
        let {rows} = await userDao.getAllUsers(models, {});
        
        let users = rows.map((user) => {
            return {
                value: user.id,
                label: user.name
            }
        })
        return {
            status: CONSTANTS.HTTP_STATUS.OK,
            success: true,
            message: 'Project users fetched successfully',
            data: users
        }
    } catch (error) {
        logger.Error(error, { filepath: '/controllers/settingController.js', function: 'getProjectUsers' });
        throw error;
    }
}

const logout = async (req) => {
    try {
        const { token } = req.body;
        let { models } = await getConnection();
        await userDeviceDao.deleteSessionByToken(models, token);
        return {
            status: CONSTANTS.HTTP_STATUS.OK,
            success: true,
            message: 'Logout successfully'
        }
    } catch (error) {
        logger.Error(error, { filepath: '/controllers/settingController.js', function: 'logout' });
        throw error;
    }
}


module.exports = {
    generateForgotPasswordToken,
    resetPassword,
    getLoginDevices,
    getUserAttendances,
    getUserNotifications,
    markAllAsRead,
    getNotificationsCount,
    getProjectUsers,
    logout
}