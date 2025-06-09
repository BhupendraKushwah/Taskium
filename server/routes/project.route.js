const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware')
const projectController = require('../controllers/projectController');
const CONSTANTS = require('../config/constant');
const upload =require('../middleware/multer')

router.get('/get-projects', verifyToken, async (req, res) => {
    projectController.getProjectsData(req, res).then(result => {
        res.status(result.status).json(result);
    }).catch(error => {
        res.status(error.status || CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message || 'Internal server error' });
    })
})


router.post('/add-project', verifyToken, upload, async (req, res) => {
    projectController.addProject(req, res).then(result => {
        res.status(result.status).json(result);
    }).catch(error => {
        res.status(error.status || CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message || 'Internal server error' });
    })
})

router.delete('/delete-project/:id', verifyToken, async (req, res) => {
    projectController.deleteProjectById(req, res).then(result => {
        res.status(result.status).json(result);
    }).catch(error => {
        res.status(error.status || CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message || 'Internal server error' });
    })
})
module.exports = router;