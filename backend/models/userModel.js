import logger from "../config/logger.js";
import pool from "../config/db.js";
import bcrypt from "bcrypt";


const createUserTable = async () => {
    try {
        let query = `CREATE TABLE IF NOT EXISTS users (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                gender ENUM('Male', 'Female', 'Other'),
                phone VARCHAR(20),
                address TEXT,
                residence VARCHAR(255),
                dob DATE,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`
        await pool.query(query);
        return { success: true, message: 'Users table created successfully' };
    } catch (error) {
        logger.Error(error, { filepath: '/models/userModel.js', function: 'createUserTable' });
        console.log(error)
        throw error;
    }
}

const createProfessionTable = async () => {
    try {
        let query = `CREATE TABLE IF NOT EXISTS professions (
            id INT PRIMARY KEY AUTO_INCREMENT,
            userId INT,
            designation VARCHAR(255),
            company VARCHAR(255),
            startDate VARCHAR(255),
            endDate VARCHAR(255),
            email VARCHAR(255),
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        )`
        await pool.query(query);
    } catch (error) {
        logger.Error(error, { filepath: '/models/userModel.js', function: 'createProfessionTable' });
        console.log(error)
        throw error;
    }
}

const createSocialTable = async () => {
    try {
        let query = `CREATE TABLE IF NOT EXISTS social (
            id INT PRIMARY KEY AUTO_INCREMENT,
            userId INT,
            facebook VARCHAR(255),
            linkedin VARCHAR(255),
            x VARCHAR(255),
            instagram VARCHAR(255),
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        )`
        await pool.query(query);
    } catch (error) {
        logger.Error(error, { filepath: '/models/userModel.js', function: 'createSocialTable' });
        console.log(error)
        throw error;
    }
}

const createUserDeviceLoginTable = async () => {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS user_device_logins (
                id INT PRIMARY KEY AUTO_INCREMENT,
                userId INT NOT NULL,
                deviceId VARCHAR(255) NOT NULL,
                deviceType ENUM('MOBILE', 'DESKTOP', 'TABLET', 'OTHER') DEFAULT 'OTHER',
                osName VARCHAR(50),
                osVersion VARCHAR(50),
                browserName VARCHAR(50),
                browserVersion VARCHAR(50),
                ipAddress VARCHAR(45) NOT NULL,
                loginTime DATETIME DEFAULT CURRENT_TIMESTAMP,
                logoutTime DATETIME,
                lastActive DATETIME,
                sessionToken VARCHAR(255) UNIQUE,
                status ENUM('ACTIVE', 'EXPIRED', 'LOGGED_OUT') DEFAULT 'ACTIVE',
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_userId (userId),
                INDEX idx_loginTime (loginTime),
                INDEX idx_sessionToken (sessionToken),
                CHECK (logoutTime IS NULL OR loginTime <= logoutTime)
            )
        `;
        await pool.query(query);
        return {
            success: true,
            message: 'User device login table created successfully'
        };
    } catch (error) {
        logger.error({
            message: error.message,
            stack: error.stack,
            filepath: '/models/deviceLoginModel.js',
            function: 'createUserDeviceLoginTable'
        });
        throw new Error('Failed to create user device login table');
    }
};

const insertDeviceLogin = async (data) => {
    try {
        const { userId, deviceId, deviceType, osName, osVersion, browserName, browserVersion, ipAddress, sessionToken } = data;
        if (!userId) throw new Error('User ID is required');
        if (!deviceId) throw new Error('Device ID is required');
        if (!deviceType) throw new Error('Device type is required');
        if (!ipAddress) throw new Error('IP address is required');

        const query = `INSERT INTO user_device_logins (userId, deviceId, deviceType, osName, osVersion, browserName, browserVersion, ipAddress, sessionToken) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [userId, deviceId, deviceType, osName, osVersion, browserName, browserVersion, ipAddress, sessionToken];
        const [result] = await pool.query(query, values);
        return {
            success: true,
            message: 'Device login inserted successfully',
            insertId: result.insertId
        }
    } catch (error) {
        logger.Error(error, { filepath: '/models/userModel.js', function: 'InsertDeviceLogin' });
        console.log(error);
        throw error;
    }
}

const insertUser = async (data) => {
    try {
        const { name, email, password, gender, phone, address, residence, dob } = data;
        if (!name) throw new Error('Name is required');
        if (!email) throw new Error('Email is required');
        if (!password) throw new Error('Password is required');
        if (!gender) throw new Error('Gender is required');
        if (!phone) throw new Error('Phone is required');
        if (!address) throw new Error('Address is required');
        if (!residence) throw new Error('Residence address is required');
        if (!dob) throw new Error('Date of birth is required');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const query = `INSERT INTO users (name, email, password, gender, phone, address, residence, dob) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [name, email, hashedPassword, gender, phone, address, residence, dob];
        const [result] = await pool.query(query, values);
        return {
            success: true,
            insertId: result.insertId,
            message: `User '${name}' created successfully`
        };
    } catch (error) {
        logger.Error(error, { filepath: '/models/userModel.js', function: 'InsertUser' });
        console.log(error);
        throw error;
    }
}

const insertProfession = async (data) => {
    try {
        const { userId, designation, company, startDate, endDate, email } = data;
        const query = `INSERT INTO professions (userId, designation, company, startDate, endDate, email) VALUES (?, ?, ?, ?, ?, ?)`;
        const values = [userId, designation, company, startDate, endDate, email];
        const [result] = await pool.query(query, values);
        return result;
    } catch (error) {
        logger.Error(error, { filepath: '/models/userModel.js', function: 'InsertProfession' });
        console.log(error);
        throw error;
    }
}

const insertSocial = async (data) => {
    try {
        const { userId, facebook, linkedin, x, instagram } = data;
        const query = `INSERT INTO social (userId, facebook, linkedin, x, instagram) VALUES (?, ?, ?, ?, ?)`;
        const values = [userId, facebook, linkedin, x, instagram];
        const [result] = await pool.query(query, values);
        return result;
    } catch (error) {
        logger.Error(error, { filepath: '/models/userModel.js', function: 'InsertSocial' });
        console.log(error);
        throw error;
    }
}

const updateUser = async (data) => {
    try {
        const { id, name, email, gender, phone, address, residence, dob } = data;
        const query = `UPDATE users SET name = ?, email = ?, gender = ?, phone = ?, address = ?, residence = ?, dob = ? WHERE id = ?`;
        const values = [name, email, gender, phone, address, residence, dob, id];
        const [result] = await pool.query(query, values);
        return result;
    } catch (error) {
        logger.Error(error, { filepath: '/models/userModel.js', function: 'updateUser' });
        console.log(error)
        throw error;
    }
}

const updateProfession = async (data) => {
    try {
        const { id, userId, designation, company, startDate, endDate, email } = data;
        const query = `UPDATE professions SET userId = ?, designation = ?, company = ?, startDate = ?, endDate = ?, email = ? WHERE id = ?`;
        const values = [userId, designation, company, startDate, endDate, email, id];
        const [result] = await pool.query(query, values);
        return result;
    } catch (error) {
        logger.Error(error, { filepath: '/models/userModel.js', function: 'updateProfession' });
        console.log(error)
        throw error;
    }
}

const updateSocial = async (data) => {
    try {
        const { id, userId, facebook, linkedin, x, instagram } = data;
        const query = `UPDATE social SET userId = ?, facebook = ?, linkedin = ?, x = ?, instagram = ? WHERE id = ?`;
        const values = [userId, facebook, linkedin, x, instagram, id];
        const [result] = await pool.query(query, values);
        return result;
    } catch (error) {
        logger.Error(error, { filepath: '/models/userModel.js', function: 'updateSocial' });
        console.log(error)
        throw error;
    }
}

const deleteUser = async (id) => {
    try {
        const query = `DELETE FROM users WHERE id = ?`;
        const values = [id];
        const [result] = await pool.query(query, values);
        return result;
    } catch (error) {
        logger.Error(error, { filepath: '/models/userModel.js', function: 'deleteUser' });
        console.log(error)
        throw error;
    }
}

const deleteProfession = async (id) => {
    try {
        const query = `DELETE FROM professions WHERE id = ?`;
        const values = [id];
        const [result] = await pool.query(query, values);
        return result;
    } catch (error) {
        logger.Error(error, { filepath: '/models/userModel.js', function: 'deleteProfession' });
        console.log(error)
        throw error;
    }
}

const deleteSocial = async (id) => {
    try {
        const query = `DELETE FROM social WHERE id = ?`;
        const values = [id];
        const [result] = await pool.query(query, values);
        return result;
    } catch (error) {
        logger.Error(error, { filepath: '/models/userModel.js', function: 'deleteSocial' });
        console.log(error)
        throw error;
    }
}

const getUserById = async (id) => {
    try {
        const query = `SELECT * FROM users WHERE id = ?`;
        const values = [id];
        const [result] = await pool.query(query, values);
        return result;
    } catch (error) {
        logger.Error(error, { filepath: '/models/userModel.js', function: 'getUserById' });
        console.log(error)
        throw error;
    }
}

const getProfessionById = async (id) => {
    try {
        const query = `SELECT * FROM professions WHERE id = ?`;
        const values = [id];
        const [result] = await pool.query(query, values);
        return result;
    } catch (error) {
        logger.Error(error, { filepath: '/models/userModel.js', function: 'getProfessionById' });
        console.log(error)
        throw error;
    }
}

const getSocialById = async (id) => {
    try {
        const query = `SELECT * FROM social WHERE id = ?`;
        const values = [id];
        const [result] = await pool.query(query, values);
        return result;
    } catch (error) {
        logger.Error(error, { filepath: '/models/userModel.js', function: 'getSocialById' });
        console.log(error)
        throw error;
    }
}

const getUsers = async () => {
    try {
        const query = `SELECT * FROM users`;
        const [result] = await pool.query(query);
        return result;
    } catch (error) {
        logger.Error(error, { filepath: '/models/userModel.js', function: 'getAllUsers' });
        console.log(error)
        throw error;
    }
}

const getProfessions = async () => {
    try {
        const query = `SELECT * FROM professions`;
        const [result] = await pool.query(query);
        return result;
    } catch (error) {
        logger.Error(error, { filepath: '/models/userModel.js', function: 'getAllProfessions' });
        console.log(error)
        throw error;
    }
}

const getSocials = async () => {
    try {
        const query = `SELECT * FROM social`;
        const [result] = await pool.query(query);
        return result;
    } catch (error) {
        logger.Error(error, { filepath: '/models/userModel.js', function: 'getAllSocials' });
        console.log(error)
        throw error;
    }
}

const getUserDetails = async (id) => {
    try {
        if (!id) throw new Error('ID is required');
        const query = `
            SELECT u.*, p.designation, p.company, p.startDate, p.endDate, s.facebook, s.linkedin, s.x, s.instagram
            FROM users u
            LEFT JOIN professions p ON u.id = p.userId
            LEFT JOIN social s ON u.id = s.userId
            WHERE u.id = ?;
        `;
        const values = [id];
        const [result] = await pool.query(query, values);
        return {
            success: result.length > 0,
            data: result.length ? result[0] : null
        };
    } catch (error) {
        logger.Error(error, { filepath: '/models/userModel.js', function: 'getUserDetails' });
        console.log(error);
        throw error;
    }
};
const checkEmailExists = async (email) => {
    try {
        const query = `SELECT COUNT(*) as count FROM users WHERE email = ?`;
        const values = [email];
        const [result] = await pool.query(query, values);
        return result[0].count > 0;
    } catch (error) {
        logger.Error(error, { filepath: '/models/userModel.js', function: 'checkEmailExists' });
        console.log(error);
        throw error;
    }
};


export {
    createUserTable,
    createProfessionTable,
    createSocialTable,
    insertUser,
    insertProfession,
    insertSocial,
    updateUser,
    updateProfession,
    updateSocial,
    deleteProfession,
    deleteSocial,
    deleteUser,
    getUserById,
    getProfessionById,
    getSocialById,
    getUsers,
    getProfessions,
    getSocials,
    getUserDetails,
    checkEmailExists
}