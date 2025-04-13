import express from 'express';
const router = express.Router();
import { addProject, deleteProjectById, getProjectsData } from '../controllers/projectController.js'
import CONSTANTS from "../config/constant.js";
import { verifyToken } from '../middleware/authMiddleware.js';
import upload from '../middleware/multer.js'

router.get('/get-projects', verifyToken, async (req, res) => {
    try {
        await getProjectsData(req, res);
    } catch (error) {
        res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message || 'Internal server error' });
    }
})


router.post('/add-project', verifyToken, upload, async (req, res) => {
    try {
        await addProject(req, res);
    } catch (error) {
        res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message || 'Internal server error' });
    }
})

router.delete('/delete-project/:id', verifyToken, async (req, res) => {
    try {
        await deleteProjectById(req, res);
    } catch (error) {
        res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message || 'Internal server error' });
    }
})
export default router;