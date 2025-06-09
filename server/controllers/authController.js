const CONSTANTS = require('../config/constant');
const logger = require('../config/logger');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const { UAParser } = require('ua-parser-js');
const userService = require('../services/userService');
const emailService = require('../services/emailService');
const { getConnection } = require('../config/db');
const userDao = require('../dao/user.dao');
const userDeviceDao = require('../dao/userLoginDevices.dao');
const attendanceDao = require('../dao/attendance.dao');
const notificationDao = require('../dao/notification.dao');
const socialDao = require('../dao/social.dao');
const professionDao = require('../dao/professions.dao');
const { uploadImage } = require('../utils/upload');

dotenv.config();
const createUser = async (body) => {
    try {
        const { email, username, password, name, phone } = body;

        // Check if email or username already exists
        const [emailExists, usernameExists] = await Promise.all([
            userService.checkEmailExists(email),
            userService.checkUsernameExists(username)
        ]);

        if (emailExists) {
            return {
                status: CONSTANTS.HTTP_STATUS.FORBIDDEN,
                success: false,
                error: 'Email already exists'
            };
        }

        if (usernameExists) {
            return {
                status: CONSTANTS.HTTP_STATUS.FORBIDDEN,
                success: false,
                error: 'Username already exists'
            };
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Get DB connection and create user
        const Domain = await getConnection();
        const user = await userDao.createUser(Domain.models, {
            email,
            username,
            password: hashedPassword,
            name,
            phone
        });

        if (user) {
            await emailService.sendWelcomeEmail(user.email, user.username);
            return {
                status: CONSTANTS.HTTP_STATUS.OK,
                success: true,
                message: 'User created successfully',
                data: { user }
            };
        }

        // If user is not created for some reason
        return {
            status: CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR,
            success: false,
            error: 'Failed to create user'
        };

    } catch (error) {
        logger.Error(error, {
            filepath: '/controllers/authController.js',
            function: 'createUser'
        });

        return {
            status: CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR,
            success: false,
            error: 'Something went wrong'
        };
    }
};

const loginUser = async (req) => {
    try {
        const { username, password, rememberMe } = req.body;

        let { models } = await getConnection();
        const user = await userDao.getUserByCondition(models, { username });
        if (!user) {
            return { status: CONSTANTS.HTTP_STATUS.UNAUTHORIZED, error: 'Invalid credentials' };
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return { status: CONSTANTS.HTTP_STATUS.UNAUTHORIZED, error: 'Invalid credentials' };
        }

        // Generate token
        const expiresIn = rememberMe ? '24h' : '1h';
        const token = jwt.sign({ userId: user.id }, process.env.JWT_TOKEN, { expiresIn });

        // Device logging
        const deviceData = {
            ...getClientDetails(req, token),
            userId: user.id
        };
console.log('deviceType value:', deviceData);
        let res = await userDeviceDao.createSession(models, deviceData);

        // Attendance tracking
        const today = new Date().toLocaleDateString('en-CA').split('T')[0];

        const { count } = await attendanceDao.getUserAttendance(models, { userId: user.id, date: today });
        if (!count) {
            await attendanceDao.insertUserAttendance(models, { userId: user.id, date: today });
        }

        // Notification
        await notificationDao.insertNotification(models, {
            userId: user.id,
            message: "We've detected a login to your account."
        });

        // Respond
        return {
            status: CONSTANTS.HTTP_STATUS.OK,
            success: true,
            data: { token, user },
            message: 'Login successful'
        };

    } catch (error) {
        logger.Error(error, {
            filepath: '/controllers/authController.js',
            function: 'loginUser'
        });

        return {
            status: CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR,
            success: false,
            error: 'Something went wrong'
        };
    }
};

const getUserbyId = async (req) => {
    try {
        const { models } = await getConnection();
        const user = await userDao.getUserById(models, req.params.id);
        if (!user) return { status: CONSTANTS.HTTP_STATUS.UNAUTHORIZED, success: false, error: 'User does not exist' }
        return {
            status: CONSTANTS.HTTP_STATUS.OK,
            success: true,
            data: { user }
        }
    } catch (error) {
        logger.Error(error, { filepath: '/controllers/authController.js', function: 'getUserbyId' });
        throw error;
    }
}

const updateProfessionDetails = async (req) => {
    try {
        const { models } = await getConnection();
        const existingProfession = await professionDao.getProfession(models, { userId: req.userId });

        let result;
        let message;

        if (existingProfession) {
            const updateResult = await professionDao.updateProfession(models, { id: existingProfession.id }, req.body);
            if (!updateResult[0]) {
                return { status: CONSTANTS.HTTP_STATUS.FORBIDDEN, error: 'An error occurred while updating profession' };
            }
            result = updateResult;
            message = 'Profession updated successfully';
        } else {
            result = await professionDao.createProfession(models, req.body);
            if (!result) {
                return { status: CONSTANTS.HTTP_STATUS.FORBIDDEN, error: 'An error occurred while adding profession' };
            }
            message = 'Profession added successfully';
        }

        return {
            status: CONSTANTS.HTTP_STATUS.OK,
            success: true,
            data: { result },
            message
        };
    } catch (error) {
        logger.Error(error, { filepath: '/controllers/authController.js', function: 'updateProfessionDetails' });
        return {
            status: CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR,
            success: false,
            error
        };
    }
};


const getUserBytoken = async (req) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return {
                success: false,
                message: 'No token provided or invalid format',
            };
        }
        let decodeToken = jwt.decode(authHeader, process.env.JWT_TOKEN);
        let userId = decodeToken.userId;
        const { models } = await getConnection();
        let user = await userDao.getUserById(models, userId);

        if (!user) return { status: CONSTANTS.HTTP_STATUS.UNAUTHORIZED, success: false, error: 'User does not exist' }

        let userProfession = await professionDao.getProfession(models, { userId })
        if (userProfession) {
            userProfession.dataValues.registeredEmail = userProfession.dataValues.email;
            delete userProfession.dataValues.email; // ✅ Correct way to remove a key from an object
        }

        let userSocialLink = await socialDao.getSocial(models, { userId });

        return {
            status: CONSTANTS.HTTP_STATUS.OK,
            success: true,
            data: {
                user: {
                    ...user?.dataValues,
                    ...userProfession?.dataValues,
                    ...userSocialLink?.dataValues
                }
            },
            message: 'User fetched successfully'
        }

    } catch (error) {
        logger.Error(error, { filepath: '/controllers/authController.js', function: 'getUserBytoken' });
        return { status: CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR, success: false, error }
    }
}

const updatePersonalInformation = async (req) => {
    try {
        const { id } = req.body;
        const { models } = await getConnection();

        // Handle image upload if file is present
        if (req.file) {
            const fileName = `user_${id}_profile-${Date.now()}`;
            const buffer = req.file.buffer;

            // Upload to Cloudinary in 3 sizes
            const [original, small, medium] = await Promise.all([
                uploadImage(buffer, {
                    public_id: fileName,
                    folder: 'taskium/profile/large',
                    overwrite: true,
                }),
                uploadImage(buffer, {
                    public_id: fileName,
                    folder: 'taskium/profile/small',
                    overwrite: true,
                    transformation: [{ width: 64, height: 82, crop: 'fill' }],
                }),
                uploadImage(buffer, {
                    public_id: fileName,
                    folder: 'taskium/profile/medium',
                    overwrite: true,
                    transformation: [{ width: 80, height: 102, crop: 'fill' }],
                }),
            ]);

            // Get extension and construct filename
            const extension = req.file.mimetype.split('/')[1];
            req.body.image = `${fileName}.${extension}`;
        } else {
            // If no new file, retain existing image from client
            req.body.image = req.body.profileImage;
        }

        // Update user record
        const result = await userDao.updateUser(models, { id: req.userId }, req.body);

        // Sequelize returns [affectedCount]; check if any row was updated
        if (!result[0]) {
            return {
                status: CONSTANTS.HTTP_STATUS.NOT_FOUND,
                success: false,
                error: 'User not found or no changes applied'
            };
        }

        return {
            status: CONSTANTS.HTTP_STATUS.OK,
            success: true,
            data: {
                image: req.body.image
            },
            message: 'Personal information updated successfully'
        };
    } catch (error) {
        logger.Error(error, {
            filepath: '/controllers/authController.js',
            function: 'updatePersonalInformation'
        });

        return {
            status: CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR,
            success: false,
            error
        };
    }
};


const updateSocialLinks = async (req) => {
    try {
        const { models } = await getConnection();
        const userId = req.userId;
        let row = await socialDao.getSocial(models, userId);

        if (!row) {
            let result = await socialDao.createSocial(models, req.body);
            if (!result) return { status: CONSTANTS.HTTP_STATUS.FORBIDDEN, error: 'An error occurred' }
            return {
                status: CONSTANTS.HTTP_STATUS.OK,
                success: true,
                data: {
                    result
                },
                message: 'Links updated successfully'
            }
        }
        let result = await socialDao.updateSocial(models, { id: row.id }, req.body);
        if (!result[0]) return { status: CONSTANTS.HTTP_STATUS.FORBIDDEN, error: 'An error occurred' }
        return {
            status: CONSTANTS.HTTP_STATUS.OK,
            success: true,
            data: {
                result
            },
            message: 'Links updated successfully'
        }
    } catch (error) {
        logger.Error(error, { filepath: '/controllers/authController.js', function: 'updateSocialLinks' });
        return { status: CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR, error }
    }
}

const getClientDetails = (req, token) => {
    const userAgent = req.headers['user-agent'];
    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    const ipAddress =
        req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        req.connection?.remoteAddress ||
        req.socket?.remoteAddress ||
        req.ip;

    const deviceId = req.headers['x-device-id'];


    return {
        deviceType: result.device.type || 'Desktop',
        osName: result.os.name || 'unknown',
        osVersion: result.os.version || 'unknown',
        browserName: result.browser.name || 'unknown',
        browserVersion: result.browser.version || 'unknown',
        ipAddress,
        sessionToken: token,
        deviceId
    };
};

module.exports = {
    createUser,
    loginUser,
    getUserbyId,
    updateProfessionDetails,
    getUserBytoken,
    updatePersonalInformation,
    updateSocialLinks
}