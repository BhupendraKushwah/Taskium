import express from 'express';
const router = express.Router();
import authRoutes from './auth.route.js';
import taskRoutes from './task.route.js';
import projectsRoutes from './project.route.js';
import settingRoutes from './setting.route.js';
router.use('/users',authRoutes);
router.use('/tasks',taskRoutes);
router.use('/projects',projectsRoutes);
router.use('/settings',settingRoutes);

export default router;