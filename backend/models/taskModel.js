import CONSTANTS from "../config/constant.js";
import logger from "../config/logger.js";
import pool from "../config/db.js";

const createTaskTable = async () => {
    try {
        let query = `CREATE TABLE IF NOT EXISTS tasks (
                        id INT PRIMARY KEY AUTO_INCREMENT,
                        subject VARCHAR(255) NOT NULL,
                        assignee INT,
                        createdBy INT,
                        dueDate DATETIME,
                        priority ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
                        projectId INT,
                        status Varchar(255),
                        startDate DATETIME,
                        type VARCHAR(255),
                        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        FOREIGN KEY (assignee) REFERENCES users(id) ON DELETE CASCADE,
                        FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE CASCADE,
                        FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE
                    )`
        await pool.query(query);
        return { success: true, message: 'Task table created successfully' };
    } catch (error) {
        logger.Error(error, { filepath: '/models/taskModel.js', function: 'createTaskTable' });
         throw error;
    }
}

const getTasks = async (filters = {}, order_by = 'createdAt', order_direction = 'DESC', limit = 10, offset = 0) => {
    try {
        let query = `SELECT * FROM tasks WHERE 1=1`; // Ensures the WHERE clause always exists
        let values = [];

        // Dynamically build query based on available filters
        if (filters.subject) {
            query += ` AND subject = ?`;
            values.push(`%${filters.subject}%`);
        }
        if (filters.assignee) {
            query += ` AND assignee = ?`;
            values.push(filters.assignee);
        }
        if (filters.status) {
            query += ` AND status = ?`;
            values.push(filters.status);
        }
        if (filters.createdBy) {
            query += ` AND createdBy = ?`;
            values.push(filters.createdBy);
        }
        if (filters.priority) {
            query += ` AND priority = ?`;
            values.push(filters.priority);
        }
        if (filters.projectId) {
            query += ` AND projectId = ?`;
            values.push(filters.projectId);
        }
        if (filters.type) {
            query += ` AND type = ?`;
            values.push(filters.type);
        }
        if (filters.startDate) {
            query += ` AND startDate >= ?`;
            values.push(filters.startDate);
        }
        if (filters.dueDate) {
            query += ` AND dueDate <= ?`;
            values.push(filters.dueDate);
        }
        if (filters.createdAt) {
            query += ` AND createdAt >= ?`;
            values.push(filters.createdAt);
        }

        // Prevent SQL injection by allowing only specific columns for ordering
        const validOrderColumns = ['id', 'assignee', 'dueDate', 'priority', 'createdAt', 'updatedAt', 'status'];
        if (!validOrderColumns.includes(order_by)) {
            order_by = 'createdAt'; // Default fallback
        }

        // Ensure order direction is either ASC or DESC
        order_direction = order_direction.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        // Add ordering and pagination (LIMIT and OFFSET) to the query
        query += ` ORDER BY ${order_by} ${order_direction} LIMIT ? OFFSET ?`;
        let limit = CONSTANTS.PAGINATION.DEFAULT_LIMIT;
        values.push(limit, offset); // Add limit and offset values to the query parameters

        const [results] = await pool.query(query, values);

        const countQuery = `SELECT COUNT(*) as total FROM tasks WHERE 1=1` + query.split('ORDER BY')[0].slice(query.indexOf('WHERE'));
        const [countResult] = await pool.query(countQuery, values.slice(0, -2)); // Exclude LIMIT and OFFSET
        const total = countResult[0].total;

        return {
            success: true,
            data: results,
            pagination: {
                limit: CONSTANTS.PAGINATION.DEFAULT_LIMIT,
                offset: offset,
                total,
                totalPages: Math.ceil(total / CONSTANTS.PAGINATION.DEFAULT_LIMIT)
            }
        };
    } catch (error) {
        logger.Error(error, { filepath: '/models/taskModel.js', function: 'getTasks' });
         throw error;
    }
};

const getTaskById = async (id) => {
    try {
        const query = `SELECT * FROM tasks WHERE id = ?`;
        const values = [id];
        const [result] = await pool.query(query, values);
        return {
            success: result.length > 0,
            data: result[0] || null
        };
    } catch (error) {
        logger.Error(error, { filepath: '/models/taskModel.js', function: 'getTaskById' });
         throw error;
    }
}

const createTask = async (data) => {
    try {
        const { subject, assignee, createdBy, dueDate, priority, projectId, status, startDate, type } = data;
        if(!subject) throw new Error('Subject is required');
        const query = `INSERT INTO tasks (subject, assignee, createdBy, dueDate, priority, projectId, status, startDate, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [subject, assignee, createdBy, dueDate, priority, projectId, status, startDate, type];
        const [result] = await pool.query(query, values);
        return {
            success: true,
            insertId: result.insertId,
        };
    } catch (error) {
        logger.Error(error, { filepath: '/models/taskModel.js', function: 'createTask' });
         throw error;
    }
}

const updateTask = async (id, data) => {
    try {
        const { subject, assignee, createdBy, dueDate, priority, projectId, status, startDate, type } = data;
        if(!subject) throw new Error('Subject is required');
        if(!id) throw new Error('ID is required');
        const query = `UPDATE tasks SET subject = ?, assignee = ?, createdBy = ?, dueDate = ?, priority = ?, projectId = ?, status = ?, startDate = ?, type = ? WHERE id = ?`;
        const values = [subject, assignee, createdBy, dueDate, priority, projectId, status, startDate, type, id];
        const [result] = await pool.query(query, values);
        if(!result.affectedRows) return {success:false, message:`No task found with ID ${id}`};
        return{
            data:result,
            success:true,
            affectedRows: result.affectedRows,
            changedRows: result.changedRows
        }
    } catch (error) {
        logger.Error(error, { filepath: '/models/taskModel.js', function: 'updateTask' });
         throw error;
    }
}

const deleteTask = async (id) => {
    try {
        if(!id) throw new Error('ID is required');
        const query = `DELETE FROM tasks WHERE id = ?`;
        const values = [id];
        const [result] = await pool.query(query, values);
        if(!result.affectedRow) return {success:false, message:`No task found with ID ${id}`};
        return {
            success: true,
            message: `Project with ID ${id} deleted successfully`,
            affectedRows: result.affectedRows
        };
    } catch (error) {
        logger.Error(error, { filepath: '/models/taskModel.js', function: 'deleteTask' });
         throw error;
    }
}

const updateTaskStatus = async (id, status) => {
    try {
        if(!id) throw new Error('ID is required');
        if(!status) throw new Error('Status is required');

        const query = `UPDATE tasks SET status = ? WHERE id = ?`;
        const values = [status, id];
        const [result] = await pool.query(query, values);
        if(!result.affectedRow) return {success:false, message:`No task found with ID ${id}`};
        return{
            data:result,
            success:true,
            affectedRows: result.affectedRows,
            changedRows: result.changedRows
        };
    } catch (error) {
        logger.Error(error, { filepath: '/models/taskModel.js', function: 'updateTaskStatus' });
         throw error;
    }
};


export { createTaskTable, getTasks, getTaskById, createTask, updateTask, deleteTask ,updateTaskStatus}