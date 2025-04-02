import jsonwebtoken from "jsonwebtoken";
import logger from "../config/logger";
import CONSTANTS from "../config/constant";

export default verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        logger.Error('Token not found', { filepath: '/middleware/authMiddleware.js', function: 'verifyToken' });
        return res.status(CONSTANTS.HTTP_STATUS.UNAUTHORIZED).json({ error: 'Access denied' });
    }
    try {
        const decoded = jsonwebtoken.verify(token, process.env.JWT_TOKEN);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        logger.Error(error, { filepath: '/middleware/authMiddleware.js', function: 'verifyToken' });
        res.status(CONSTANTS.HTTP_STATUS.UNAUTHORIZED).json({ error: 'Invalid token' });
    }
}