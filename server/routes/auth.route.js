const express = require('express');
const router = express.Router();
const CONSTANTS = require('../config/constant.js');
const authController = require('../controllers/authController')
const verifyToken = require('../middleware/authMiddleware')
const upload =require('../middleware/multer')

router.get('/', verifyToken, (req, res) => {
    authController.getUserBytoken(req).then(result => {
        res.status(result.status).json(result);
    }).catch(error => {
        res.status(error.status || CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message || 'Internal server error' });
    })
})
router.post('/signup', (req, res) => {
    authController.createUser(req.body).then(result => {
        res.status(result.status).json(result);
    }).catch(error => {
        res.status(error.status || CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message || 'Internal server error' });
    })

})

router.post('/login', (req, res) => {
    authController.loginUser(req, res).then(result => {
        res.status(result.status).json(result);
    }).catch(error => {
        res.status(error.status || CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message || 'Internal server error' });
    })
})

router.get('/profile/:id', verifyToken, async (req, res) => {
    authController.getUserbyId(req, res).then(result => {
        res.status(result.status).json(result);
    }).catch(error => {
        res.status(error.status || CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message || 'Internal server error' });
    })
})

router.put('/profile/updateProfession/:id', verifyToken, async (req, res) => {
    authController.updateProfessionDetails(req, res).then(result => {
        res.status(result.status).json(result);
    }).catch(error => {
        res.status(error.status || CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message || 'Internal server error' });
    })
})

router.put('/profile/:id', verifyToken, upload, async (req, res) => {
    authController.updatePersonalInformation(req, res).then(result => {
        res.status(result.status).json(result);
    }).catch(error => {
        res.status(error.status || CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message || 'Internal server error' });
    })
})

router.put('/profile/socialLinks/:id', verifyToken, async (req, res) => {
    authController.updateSocialLinks(req, res).then(result => {
        res.status(result.status).json(result);
    }).catch(error => {
        res.status(error.status || CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message || 'Internal server error' });
    })
})

router.get('/profile/profession/:id', verifyToken, async (req, res) => {
    authController.getProfession(req, res).then(result => {
        res.status(result.status).json(result);
    }).catch(error => {
        res.status(error.status || CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message || 'Internal server error' });
    })
})
router.get('/profile/socialLinks/:id', verifyToken, async (req, res) => {
    authController.getSocialLinks(req, res).then(result => {
        res.status(result.status).json(result);
    }).catch(error => {
        res.status(error.status || CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message || 'Internal server error' });
    })
})


module.exports = router;