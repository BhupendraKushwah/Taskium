import CONSTANTS from '../config/constant.js';
import pool from '../config/db.js';
import logger from '../config/logger.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { insertUser, checkEmailExists, checkUsernameExists, getUserById, updateProfession, insertProfession, updateUser, updateSocial, insertSocial } from '../models/userModel.js'
import { sendWelcomeEmail } from '../services/emailService.js';
import cloudinary from '../config/cloudinary.js';
import { uploadImage } from '../utils/upload.js';
dotenv.config();
const createUser = async (req, res) => {
    try {
        let { email, username } = req.body;

        let emailExists = await checkEmailExists(email);
        let usernameExists = await checkUsernameExists(username);

        if (emailExists) res.status(CONSTANTS.HTTP_STATUS.FORBIDDEN).json({
            success: false,
            error: 'Email already exist'
        });
        if (usernameExists) res.status(CONSTANTS.HTTP_STATUS.FORBIDDEN).json({
            success: false,
            error: 'Username already exist'
        });

        const result = await insertUser(req.body);

        res.status(CONSTANTS.HTTP_STATUS.OK).json({
            success: true,
            data: {
                insertId: result.insertId
            },
            message: result.message
        });
    } catch (error) {
        logger.Error(error, { filepath: '/controllers/settingController.js', function: 'createUser' });
        res.status(CONSTANTS.HTTP_STATUS.UNAUTHORIZED).json({ error })
    }
}

const loginUser = async (req, res) => {
    try {
        const { username, password, rememberMe } = req.body;

        let query = `SELECT * FROM users WHERE username = ?`;
        const values = [username];
        const [row] = await pool.query(query, values);

        if (!row.length) return res.status(CONSTANTS.HTTP_STATUS.UNAUTHORIZED).json({ error: 'Invalid credentials' })

        if (await bcrypt.compare(password, row[0].password)) {
            let expiresIn = rememberMe ? '24hrs' : '10min';
            const token = jwt.sign({ userId: row[0].id }, process.env.JWT_TOKEN, { expiresIn });
            sendWelcomeEmail(row[0].email, row[0].username);
            res.status(CONSTANTS.HTTP_STATUS.OK).json({
                success: true,
                data: {
                    token,
                    user: row[0]
                },
                message: 'Login successful'
            });
        } else {
            res.status(CONSTANTS.HTTP_STATUS.UNAUTHORIZED).json({ error: 'Invalid credentials' })
        }
    } catch (error) {
        logger.Error(error, { filepath: '/controllers/settingController.js', function: 'loginUser' });
        res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error })
    }
}

const getUserbyId = async (req, res) => {
    try {
        let [user] = await getUserById(req.params.id);
        if (!user) return res.status(CONSTANTS.HTTP_STATUS.UNAUTHORIZED).json({ success: false, error: 'User does not exist' })
        return res.status(CONSTANTS.HTTP_STATUS.OK).json({
            success: true,
            data: {
                user
            },
            message: 'User fetched successfully'
        })
    } catch (error) {
        logger.Error(error, { filepath: '/controllers/settingController.js', function: 'getUserbyId' });
        res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error })
    }
}

const updateProfessionDetails = async (req, res) => {
    try {
        let result;
        let query = `SELECT * FROM professions where userId = ?`;
        let values = [req.userId];
        let [row] = await pool.query(query, values);
        if (!row.length) {
            result = await insertProfession(req.body);
            if (!result.affectedRows) return res.status(CONSTANTS.HTTP_STATUS.FORBIDDEN).json({ error: 'An error occurred' })
            return res.status(CONSTANTS.HTTP_STATUS.OK).json({
                success: true,
                data: {
                    result
                },
                message: 'Profession added successfully'
            })
        }
        else {
            req.body.id = row[0].id;
            result = await updateProfession(req.body);
            if (result.affectedRows === 0) return res.status(CONSTANTS.HTTP_STATUS.FORBIDDEN).json({ error: 'An error occurred' })
            return res.status(CONSTANTS.HTTP_STATUS.OK).json({
                success: true,
                data: {
                    result
                },
                message: 'Profession updated successfully'
            })
        }
    } catch (error) {
        logger.Error(error, { filepath: '/controllers/settingController.js', function: 'updateProfession' });
        res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error })
    }
}

const getUserBytoken = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(CONSTANTS.HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                message: 'No token provided or invalid format',
            });
        }
        let decodeToken = jwt.decode(authHeader, process.env.JWT_TOKEN);
        let userId = decodeToken.userId;
        let [user] = await getUserById(userId);
        
        if (!user) return res.status(CONSTANTS.HTTP_STATUS.UNAUTHORIZED).json({ success: false, error: 'User does not exist' })
        return res.status(CONSTANTS.HTTP_STATUS.OK).json({
            success: true,
            data: {
                user
            },
            message: 'User fetched successfully'
        })

    } catch (error) {
        logger.Error(error, { filepath: '/controllers/settingController.js', function: 'getUserBytoken' });
        res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error })
    }
}

const updatePersonalInformation = async (req, res) => {
    try {
        if (req.file) {
            const fileName = `user_${req.body.id}_profile-${Date.now()}`;
            const buffer = req.file.buffer
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
            const extension = req.file.mimetype.split('/')[1];
            req.body.image = `${fileName}.${extension}`;
        }
        else req.body.image = req.body.profileImage
        let result = await updateUser(req.body);
        if (result.affectedRows === 0) return res.status(CONSTANTS.HTTP_STATUS.FORBIDDEN).json({ error: 'An error occurred' })
        return res.status(CONSTANTS.HTTP_STATUS.OK).json({
            success: true,
            data: {
                result,
                image: req.body.image
            },
            message: 'Profession updated successfully'
        })
    } catch (error) {
        logger.Error(error, { filepath: '/controllers/settingController.js', function: 'updatePersonalInformation' });
        res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error })
    }
}

const updateSocialLinks = async (req, res) => {
    try {
        let query = `SELECT * FROM social where userId = ?`;
        let values = [req.userId];
        let [row] = await pool.query(query, values);
        if (!row.length) {
            let result = await insertSocial(req.body);
            if (!result.affectedRows) return res.status(CONSTANTS.HTTP_STATUS.FORBIDDEN).json({ error: 'An error occurred' })
            return res.status(CONSTANTS.HTTP_STATUS.OK).json({
                success: true,
                data: {
                    result
                },
                message: 'Links updated successfully'
            })
        }
        req.body.id = row[0].id;
        let result = await updateSocial(req.body);
        if (!result.affectedRows) return res.status(CONSTANTS.HTTP_STATUS.FORBIDDEN).json({ error: 'An error occurred' })
        return res.status(CONSTANTS.HTTP_STATUS.OK).json({
            success: true,
            data: {
                result
            },
            message: 'Links updated successfully'
        })
    } catch (error) {
        logger.Error(error, { filepath: '/controllers/settingController.js', function: 'updateSocialLinks' });
        res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error })
    }
}


export {
    createUser,
    loginUser,
    getUserbyId,
    updateProfessionDetails,
    getUserBytoken,
    updatePersonalInformation,
    updateSocialLinks
}