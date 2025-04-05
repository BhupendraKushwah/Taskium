import logger from "../config/logger.js";
import pool from "../config/db.js";

const createAttendanceTable = async () => {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS user_attendance (
                id INT PRIMARY KEY AUTO_INCREMENT,
                userId INT NOT NULL,
                status ENUM('PRESENT', 'ABSENT', 'LATE', 'EXCUSED') DEFAULT 'PRESENT',
                date DATE NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE KEY unique_user_date (userId, date),
                INDEX idx_userId (userId),
                INDEX idx_date (date),
                CHECK (checkOutTime IS NULL OR checkInTime IS NULL OR checkOutTime >= checkInTime)
            )
        `;
        await pool.query(query);
        return {
            success: true,
            message: 'Attendance table created successfully'
        };
    } catch (error) {
        logger.Error(error, { filepath: '/models/attendanceModel.js', function: 'createAttendanceTable' });
        throw new Error(error);
    }
};

const getUserAttendance = async (userId, options = {}) => {
    try {
        // Validate userId
        if (!userId) {
            throw new Error('User ID is required');
        }

        const {
            startDate = null,
            endDate = null,
            status = null,
            limit = CONSTANTS.PAGINATION.DEFAULT_LIMIT || 31,
            offset = 0,
            sortBy = 'date',
            sortOrder = 'DESC'
        } = options;

        // Build the query
        let query = `
            SELECT 
                id,
                userId,
                status,
                date,
                createdAt,
                updatedAt
            FROM user_attendance
            WHERE userId = ?
        `;
        const queryParams = [userId];

        // Add optional filters
        if (startDate) {
            query += ` AND date >= ?`;
            queryParams.push(startDate);
        }
        if (endDate) {
            query += ` AND date <= ?`;
            queryParams.push(endDate);
        }
        if (status) {
            query += ` AND status = ?`;
            queryParams.push(status.toUpperCase());
        }

        // Add sorting
        const validSortFields = ['date', 'createdAt', 'status'];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'date';
        const validSortOrders = ['ASC', 'DESC'];
        const order = validSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';
        query += ` ORDER BY ${sortField} ${order}`;

        // Add pagination
        query += ` LIMIT ? OFFSET ?`;
        queryParams.push(parseInt(limit), parseInt(offset));

        const [rows] = await pool.query(query, queryParams);

        return {
            success: true,
            data: rows,
            count: rows.length,
            filters: {
                userId,
                startDate,
                endDate,
                status
            }
        };
    } catch (error) {
        logger.Error(error, { filepath: '/models/attendanceModel.js', function: 'getUserAttendance' });
        console.error('Error fetching attendance:', error.message);
        throw new Error('Failed to retrieve user attendance');
    }
};

const insertUserAttendance = async (data) => {
    try {
        const { userId, status, date } = data;
        if (!userId) throw new Error('User ID is required');
        if (!status) throw new Error('Status is required');
        if (!date) throw new Error('Date is required');
        const query = `INSERT INTO user_attendance (userId, status, date) VALUES (?, ?, ?)`;
        const values = [userId, status.toUpperCase(), date];
        const [result] = await pool.query(query, values);
        return {
            success: true,
            message: 'User attendance inserted successfully',
            insertId: result.insertId
        };
    } catch (error) {
        logger.Error(error, { filepath: '/models/attendanceModel.js', function: 'insertUserAttendance' });
        throw error;
    }
};

export {
    createAttendanceTable,
    getUserAttendance,
    insertUserAttendance
}