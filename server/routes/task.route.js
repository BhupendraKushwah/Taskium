const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware')
const taskController = require('../controllers/taskController');
const CONSTANTS = require('../config/constant');

router.get('/', verifyToken, async (req, res) => {
    taskController.getAllTasks(req, res).then(result => {
        res.status(result.status).json(result);
    }).catch(error => {
        res.status(error.status || CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message || 'Internal server error' });
    })
})

router.post('/addTask', verifyToken, async (req, res) => {
    taskController.addTask(req, res).then(result => {
        res.status(result.status).json(result);
    }).catch(error => {
        res.status(error.status || CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message || 'Internal server error' });
    })
})

router.delete('/deleteTask', verifyToken, async (req, res) => {
    taskController.removeTask(req,res).then(result=>{
        res.status(result.status).json(result);
    }).catch(error => {
        res.status(error.status || CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message || 'Internal server error' });
    })
})


router.put('/updateTask', verifyToken, async (req, res) => {
    taskController.editTask(req,res).then(result=>{
        res.status(result.status).json(result);
    }).catch(error => {
        res.status(error.status || CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message || 'Internal server error' });
    })
})

router.put('/updateTaskStatus', verifyToken, async (req, res) => {
    taskController.updateTaskStatus(req,res).then(result=>{
        res.status(result.status).json(result);
    }).catch(error => {
        res.status(error.status || CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message || 'Internal server error' });
    })
})

router.get('/dashboard-task', verifyToken, async (req, res) => {
    taskController.dashboardTask(req,res).then(result=>{
        res.status(result.status).json(result);
    }).catch(error => {
        res.status(error.status || CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message || 'Internal server error' });
    })
})

module.exports = router;