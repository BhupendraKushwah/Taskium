const express = require('express');
const router = express.Router();
const CONSTANTS = require('../config/constant');
const settingController = require('../controllers/settingController')
const verifyToken = require('../middleware/authMiddleware')

router.post('/forgot-password', async (req, res) => {
    settingController.generateForgotPasswordToken(req, res).then(result => {
        res.status(result.status).json(result);
    }).catch(error => {
        res.status(error.status || CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message || 'Internal server error' });
    })
})

router.post('/reset-password/:token', async (req, res) => {
    settingController.resetPassword(req, res).then(result => {
        res.status(result.status).json(result);
    }).catch(error => {
        res.status(error.status || CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message || 'Internal server error' });
    })
})

router.get('/login-devices', verifyToken, async (req, res) => {
    settingController.getLoginDevices(req, res).then(result => {
        res.status(result.status).json(result);
    }).catch(error => {
        res.status(error.status || CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message || 'Internal server error' });
    })
})

router.post('/logout', verifyToken, async (req, res) => {
    settingController.logout(req, res).then(result => {
        res.status(result.status).json(result);
    }).catch(error => {
        res.status(error.status || CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message || 'Internal server error' });
    })
})

router.get('/attendance', verifyToken, async (req, res) => {
    settingController.getUserAttendances(req, res).then(result => {
        res.status(result.status).json(result);
    }).catch(error => {
        res.status(error.status || CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message || 'Internal server error' });
    })
})

router.get('/notifications', verifyToken, async (req, res) => {
    settingController.getUserNotifications(req, res).then(result => {
        res.status(result.status).json(result);
    }).catch(error => {
        res.status(error.status || CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message || 'Internal server error' });
    })
})

router.post('/mark-all-as-read', verifyToken, async (req, res) => {
    settingController.markAllAsRead(req, res).then(result => {
        res.status(result.status).json(result);
    }).catch(error => {
        res.status(error.status || CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message || 'Internal server error' });
    })
})

router.get('/get-notification-count', verifyToken, async (req, res) => {
    settingController.getNotificationsCount(req, res).then(result => {
        res.status(result.status).json(result);
    }).catch(error => {
        res.status(error.status || CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message || 'Internal server error' });
    })
})

router.get('/get-users', verifyToken, async (req, res) => {
    settingController.getProjectUsers(req, res).then(result => {
        res.status(result.status).json(result);
    }).catch(error => {
        res.status(error.status || CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message || 'Internal server error' });
    })
})
module.exports =router;