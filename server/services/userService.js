const { getConnection } = require('../config/db');
const logger = require('../config/logger');
const userDao = require('../dao/user.dao');
const userModel = require('../models/userModel');
const checkEmailExists = async (email) => {
    try {
        if (!email) return false;
        let Domain = await getConnection();
        let response = await userDao.getUserByCondition(Domain.models, { email });
        if (response) return true;
        return false;
    }
    catch (error) {
        logger.Error(error, { filepath: '/services/userService.js', function: 'checkEmailExists' });
        throw error;
    }

}
const checkUsernameExists = async (username) => {
    try {
        if (!username) return false;
        let Domain = await getConnection();
        let response = await userDao.getUserByCondition(Domain.models, { username });
        if (response) return true;
        return false;
    }
    catch (error) {
        logger.Error(error, { filepath: '/services/userService.js', function: 'checkUsernameExists' });
        throw error;
    }
}

module.exports = {
    checkEmailExists,
    checkUsernameExists
}