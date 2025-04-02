import express from 'express';
const router = express.Router();
import authRoutes from './authRoutes/index.js';
import taskRoutes from './taskRoutes/index.js';
import projectsRoutes from './projectsRoutes/index.js';
import settingRoutes from './settingRoutes/index.js';
router.use('/users',authRoutes);
router.use('/tasks',taskRoutes);
router.use('/projects',projectsRoutes);
router.use('/settings',settingRoutes);

export default router;