import logger from "../config/logger.js";
import pool from "../config/db.js";
import bcrypt from "bcrypt";


const createUserTable = async () => {
    try {
        let query = `CREATE TABLE IF NOT EXISTS users (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                gender ENUM('Male', 'Female', 'Other'),
                phone VARCHAR(20),
                address TEXT,
                residence VARCHAR(255),
                dob DATE,
                passwordResetToken VARCHAR(255) Default NULL,
                image VARCHAR(255) Default NULL,
	            fcm_token VARCHAR(255) NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`
        await pool.query(query);
        return { success: true, message: 'Users table created successfully' };
    } catch (error) {
        logger.Error(error, { filepath: '/models/userModel.js', function: 'createUserTable' });
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
        throw error;
    }
}

const insertUser = async (data) => {
    try {
        const { name, email, password, gender, phone, address, residence, dob, image, username } = data;
        if (!name) throw new Error('Name is required');
        if (!email) throw new Error('Email is required');
        if (!password) throw new Error('Password is required');
        if (!phone) throw new Error('Phone is required');
        if (!username) throw new Error('Username is required');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const query = `INSERT INTO users (name, email, password, gender, phone, address, residence, dob,image,username) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?)`;
        const values = [name, email, hashedPassword, gender, phone, address, residence, dob, image, username];
        const [result] = await pool.query(query, values);
        return {
            success: true,
            insertId: result.insertId,
            message: `User '${name}' created successfully`
        };
    } catch (error) {
        logger.Error(error, { filepath: '/models/userModel.js', function: 'InsertUser' });
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
        throw error;
    }
}

const updateUser = async (data) => {
    try {
        const { id, name, email, gender, phone, address, residence, dob, image } = data;
        const query = `UPDATE users SET name = ?, email = ?, gender = ?, phone = ?, address = ?, residence = ?, dob = ?, image=? WHERE id = ?`;
        const values = [name, email, gender, phone, address, residence, dob,image, id];
        const [result] = await pool.query(query, values);
        return result;
    } catch (error) {
        logger.Error(error, { filepath: '/models/userModel.js', function: 'updateUser' });
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
        throw error;
    }
}

const getUserById = async (id) => {
    try {
        const query = `
        SELECT 
          users.id,
          users.name,
          users.username,
          users.email,
          users.phone,
          users.image,
          users.gender,
          users.dob,
          users.address,
          users.residence,
          users.fcm_token,
          users.password,
          users.passwordResetToken,
          professions.designation,
          professions.company,
          professions.startDate,
          professions.endDate,
          professions.email as registeredEmail,
          social.linkedin,
          social.instagram,
          social.facebook,
          social.x
        FROM users
        LEFT JOIN professions ON users.id = professions.userId
        LEFT JOIN social ON users.id = social.userId
        WHERE users.id = ?
      `;      
        const values = [id];
        const [result] = await pool.query(query, values);
        return result;
    } catch (error) {
        logger.Error(error, { filepath: '/models/userModel.js', function: 'getUserById' });
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
        throw error;
    }
};

const checkUsernameExists = async (username) => {
    try {
        const query = `SELECT COUNT(*) as count FROM users WHERE username = ?`;
        const values = [username];
        const [result] = await pool.query(query, values);
        return result[0].count > 0;
    } catch (error) {
        logger.Error(error, { filepath: '/models/userModel.js', function: 'checkEmailExists' });
        throw error;
    }
};

const getTableFields = async (tableName, fields = [], options = {}) => {
    try {
        // Validate inputs
        if (!tableName) {
            throw new Error('Table name is required');
        }

        // Whitelist of allowed tables to prevent SQL injection
        const allowedTables = ['users', 'professions', 'social', 'user_device_logins'];
        if (!allowedTables.includes(tableName.toLowerCase())) {
            throw new Error('Invalid table name');
        }

        const {
            where = {},
            limit = 50,
            offset = 0,
            sortBy = 'createdAt',
            sortOrder = 'DESC'
        } = options;

        // If no fields specified, get all columns safely
        let columns = '*';
        if (fields.length > 0) {
            // Validate and sanitize fields
            const sanitizedFields = fields.map(field =>
                field.replace(/[^a-zA-Z0-9_]/g, '') // Basic sanitization
            ).filter(field => field.length > 0);

            if (sanitizedFields.length === 0) {
                throw new Error('Invalid field names provided');
            }
            columns = sanitizedFields.join(', ');
        }

        // Build the query
        let query = `SELECT ${columns} FROM ${tableName}`;
        const queryParams = [];

        // Add WHERE conditions
        if (Object.keys(where).length > 0) {
            query += ' WHERE ';
            const conditions = Object.entries(where).map(([key, value]) => {
                queryParams.push(value);
                return `${key.replace(/[^a-zA-Z0-9_]/g, '')} = ?`;
            });
            query += conditions.join(' AND ');
        }

        // Add sorting
        const sortField = sortBy.replace(/[^a-zA-Z0-9_]/g, '');
        const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        query += ` ORDER BY ${sortField} ${order}`;

        // Add pagination
        query += ` LIMIT ? OFFSET ?`;
        queryParams.push(parseInt(limit), parseInt(offset));

        const [result] = await pool.query(query, queryParams);

        return {
            success: true,
            data: result,
            count: result.length,
            table: tableName,
            fields: fields.length > 0 ? fields : 'all',
            filters: where
        };
    } catch (error) {
        logger.Error(error, { filepath: '/models/userModel.js', function: 'getTableFields' });
        throw new Error(`Failed to retrieve data from ${tableName}: ${error.message}`);
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
    checkEmailExists,
    checkUsernameExists,
    createUserDeviceLoginTable,
    getTableFields,
    insertDeviceLogin,
}