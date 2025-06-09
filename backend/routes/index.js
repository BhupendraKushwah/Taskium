const  express = require('express');
const router = express.Router();
const authRoutes =  require('./auth.route');
const taskRoutes =  require('./task.route');
const projectsRoutes =  require('./project.route');
const settingRoutes =  require('./setting.route');
router.use('/users',authRoutes);
router.use('/tasks',taskRoutes);
router.use('/projects',projectsRoutes);
router.use('/settings',settingRoutes);

module.exports = router;