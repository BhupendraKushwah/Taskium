import CONSTANTS from '../config/constant.js';
import pool from '../config/db.js';
import logger from '../config/logger.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { insertUser, checkEmailExists, checkUsernameExists } from '../models/userModel.js'
import { sendWelcomeEmail } from '../services/emailService.js';
dotenv.config();
const createUser = async (req, res) => {
    try {
        let { email, username } = req.body;

        let emailExists = await checkEmailExists(email);
        let usernameExists = await checkUsernameExists(username);
        console.log(emailExists)
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
            let expiresIn = rememberMe ? '24hrs' : '1hr';
            console.log(expiresIn)
            const token = jwt.sign({ userId: row[0].id }, process.env.JWT_TOKEN, { expiresIn });
            sendWelcomeEmail(row[0].email,row[0].username);
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
        res.status(CONSTANTS.HTTP_STATUS.UNAUTHORIZED).json({ error })
    }
}


export { createUser, loginUser }