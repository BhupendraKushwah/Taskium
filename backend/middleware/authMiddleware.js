const jwt = require('jsonwebtoken');
const logger =require( "../config/logger");
const CONSTANTS =  require("../config/constant");
const userDeviceDao = require('../dao/userLoginDevices.dao.js');
const { getConnection } = require('../config/db.js');


const verifyToken = async (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        logger.Error('Token not found', { filepath: '/middleware/authMiddleware.js', function: 'verifyToken', header: req.headers, body: req.body, params: req.params });
        return res.status(CONSTANTS.HTTP_STATUS.UNAUTHORIZED).json({ error: 'Access denied' });
    }
    try {
        const { models } = await getConnection();
        let response = await userDeviceDao.findSessionByToken(models,token)
        if (!response) {
            return res.status(CONSTANTS.HTTP_STATUS.UNAUTHORIZED).json({ error: 'Access denied' });
        }
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        // await deleteSessionByToken(token)
        logger.Error(error, { filepath: '/middleware/authMiddleware.js', function: 'verifyToken' });
        res.status(CONSTANTS.HTTP_STATUS.UNAUTHORIZED).json({ error: 'Invalid token' });
    }
}

module.exports = verifyToken