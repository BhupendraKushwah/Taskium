import logger from "../config/logger.js";
import pool from "../config/db.js";
import CONSTANTS from "../config/constant.js";

const createNotificationTable = async () => {
    try {
        let query = `CREATE TABLE IF NOT EXISTS notifications(
        id INT PRIMARY KEY AUTO_INCREMENT,
        userId INT  NOT NULL,
        message VARCHAR(255)  NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        isRead BOOLEAN DEFAULT FALSE,
        url VARCHAR(255),
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_userId (userId)
    )`;
        await pool.query(query);
        return {
            success: true,
            message: 'Notification table created successfully'
        }
    } catch (error) {
        logger.Error(error, { filepath: '/models/notificationModel.js', function: 'createNotificationTable' });
        console.log(error)
        throw error;
    }
}
const getNotifications = async (userId, options = {}) => {
    try {
        const {
            limit = CONSTANTS.PAGINATION.DEFAULT_LIMIT || 50,
            offset = 0,
            isRead = null,
            sortOrder = 'DESC'
        } = options;

        // Build the base query
        let query = `
            SELECT 
                id,
                userId,
                message,
                createdAt,
                url,
                isRead,
                type
            FROM notifications
            WHERE 1=1
        `;

        // Add conditions based on parameters
        const queryParams = [];

        if (userId) {
            query += ` AND userId = ?`;
            queryParams.push(userId);
        }

        if (isRead !== null) {
            query += ` AND isRead = ?`;
            queryParams.push(isRead);
        }
        const validSortOrders = ['ASC', 'DESC'];
        const order = validSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';
        query += ` ORDER BY createdAt ${order}`;

        // Add pagination
        query += ` LIMIT ? OFFSET ?`;
        queryParams.push(parseInt(limit), parseInt(offset));

        const [result] = await pool.query(query, queryParams);

        return {
            success: true,
            data: result,
            count: result.length
        };
    } catch (error) {
        logger.Error(error, { filepath: '/models/notificationModel.js', function: 'getNotifications' });
        console.error('Error fetching notifications:', error.message);
        throw new Error('Failed to retrieve notifications');
    }
};

const markNotificationAsRead = async (userId, notificationId = null, markAll = false) => {
    try {
        if (!userId) throw new Error('User ID is required');
        let query, values, result
        if (markAll) {
            query = `UPDATE notifications SET isRead = 1 WHERE userId = ? AND isRead = FALSE`;
            values = [userId];
            [result] = await pool.query(query, values);
            if (!result.affectedRows) return { success: false, message: `No notification found to mark as read` };
            return {
                success: true,
                message: 'All notifications marked as read',
                affectedRows: result.affectedRows
            }
        } else {
            if (!notificationId) throw new Error('Notification ID is required');

            query = `UPDATE notifications SET isRead = 1 WHERE id = ? AND userId = ? AND isRead = FALSE`;
            values = [notificationId, userId];
            [result] = await pool.query(query, values);

            if (!result.affectedRows) return { success: false, message: `No notification found to mark as read` };

            return {
                success: true,
                message: 'Notification marked as read',
                affectedRows: result.affectedRows
            }
        }
    } catch (error) {
        logger.Error(error, { filepath: '/models/notificationModel.js', function: 'markNotificationAsRead' });
        console.log(error);
        throw error;
    }
}

const deleteNotification = async (id) => {
    try {
        if (!id) throw new Error('ID is required');
        const query = `DELETE FROM notifications WHERE id = ?`;
        const values = [id];
        const [result] = await pool.query(query, values);
        if (!result.affectedRow) return { success: false, message: `No notification found with ID ${id}` };
        return {
            success: true,
            message: `Notification with ID ${id} deleted successfully`,
            affectedRows: result.affectedRows
        };
    } catch (error) {
        logger.Error(error, { filepath: '/models/notificationModel.js', function: 'deleteNotification' });
        console.log(error)
        throw error;
    }
}

const deleteAllNotifications = async (userId) => {
    try {
        if (!userId) throw new Error('User ID is required');
        const query = `DELETE FROM notifications WHERE userId = ?`;
        const values = [userId];
        const [result] = await pool.query(query, values);
        if (!result.affectedRow) return { success: false, message: `No notification found to delete` };
        return {
            success: true,
            message: `All notifications deleted successfully`,
            affectedRows: result.affectedRows
        };
    } catch (error) {
        logger.Error(error, { filepath: '/models/notificationModel.js', function: 'deleteAllNotifications' });
        console.log(error)
        throw error;
    }
}

const getNotificationById = async (id) => {
    try {
        if (!id) throw new Error('ID is required');
        let query = `SELECT * FROM notifications WHERE id = ?`;
        let values = [id];
        const [result] = await pool.query(query, values);
        return {
            success: result.length > 0,
            data: result[0] || null
        };
    } catch (error) {
        logger.Error(error, { filepath: '/models/notificationModel.js', function: 'getNotificationById' });
        console.log(error)
        throw error;
    }
}

const insertNotification = async (data) => {
    try {
        const { userId, message, url } = data;
        if(!userId) throw new Error('User ID is required');
        if(!message) throw new Error('Message is required');
        if(!url) throw new Error('URL is required');
        const query = `INSERT INTO notifications (userId, message, url) VALUES (?, ?, ?)`;
        const values = [userId, message, url];
        const [result] = await pool.query(query, values);
        return {
            success: true,
            message: 'Notification inserted successfully',
            insertId: result.insertId
        };
    } catch (error) {
        logger.Error(error, { filepath: '/models/notificationModel.js', function: 'insertNotification' });
        console.log(error)
        throw error;
    }
}

export {
    createNotificationTable,
    getNotifications,
    markNotificationAsRead,
    deleteNotification,
    deleteAllNotifications,
    getNotificationById,
    insertNotification
}