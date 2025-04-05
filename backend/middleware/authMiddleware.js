import jsonwebtoken from "jsonwebtoken";
import logger from "../config/logger.js";
import CONSTANTS from "../config/constant.js";
import {deleteSessionByToken, findSessionByToken} from '../models/userModel.js'

export const verifyToken = async (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        logger.Error('Token not found', { filepath: '/middleware/authMiddleware.js', function: 'verifyToken' });
        return res.status(CONSTANTS.HTTP_STATUS.UNAUTHORIZED).json({ error: 'Access denied' });
    }
    try {
        let response = await findSessionByToken(token)
        if(!response?.length){
            return res.status(CONSTANTS.HTTP_STATUS.UNAUTHORIZED).json({ error: 'Access denied' });
        }
        const decoded = jsonwebtoken.verify(token, process.env.JWT_TOKEN);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        await deleteSessionByToken(token)
        logger.Error(error, { filepath: '/middleware/authMiddleware.js', function: 'verifyToken' });
        res.status(CONSTANTS.HTTP_STATUS.UNAUTHORIZED).json({ error: 'Invalid token' });
    }
}