import express from 'express';
const router = express.Router();
import { createUser, loginUser, getUserbyId, updateProfessionDetails, getUserBytoken, updatePersonalInformation, updateSocialLinks } from '../controllers/authController.js'
import CONSTANTS from "../config/constant.js";
import { verifyToken } from '../middleware/authMiddleware.js'
import upload from '../middleware/multer.js'
import logger from '../config/logger.js';

router.get('/', verifyToken, (req, res) => {
    try {
        getUserBytoken(req, res);
    } catch (error) {
        res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
})
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

router.get('/profile/:id', verifyToken, async (req, res) => {
    try {
        await getUserbyId(req, res);
    } catch (error) {
        res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
})

router.put('/profile/updateProfession/:id', verifyToken, async (req, res) => {
    try {
        await updateProfessionDetails(req, res);
    } catch (error) {
        res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
})

router.put('/profile/:id', verifyToken, upload, async (req, res) => {
    try {
        await updatePersonalInformation(req, res);
    } catch (error) {
        res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
})

router.put('/profile/socialLinks/:id', verifyToken, async (req, res) => {
    try {
        await updateSocialLinks(req, res)
    } catch (error) {
        logger.Error(error, { filepath: '/controllers/settingController.js', function: 'updateSocialLinks' });
        res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error })
    }
})


export default router;