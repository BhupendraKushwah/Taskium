import logger from "../config/logger.js";
import pool from "../config/db.js";
import CONSTANTS from "../config/constant.js";

const createProjectTable = async () => {
    try {
        const query = `CREATE TABLE IF NOT EXISTS projects (
                        id INT PRIMARY KEY AUTO_INCREMENT,
                        projectName VARCHAR(255) NOT NULL,
                        description TEXT,
                        status ENUM('Not Started', 'In Progress', 'Completed') NOT NULL DEFAULT 'Not Started',
                        startDate DATE,
                        dueDate DATE,
                        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                    );`
        await pool.query(query);
        return { success: true, message: 'Project table created successfully' };
    } catch (error) {
        logger.Error(error, { filepath: '/models/projectModel.js', function: 'createProjectTable' });
        console.log(error);
        throw error;
    }
}

const getProjects = async (filters = {}, order_by = 'createdAt', order_direction = 'DESC', offset = 0) => {
    try {
        let query = `SELECT * FROM projects WHERE 1=1`; // Ensures the WHERE clause always exists
        let values = [];

        // Dynamically build query based on available filters
        if (filters.projectName) {
            query += ` AND projectName = ?`;
            values.push(`%${filters.projectName}%`);
        }
        if (filters.description) {
            query += ` AND description = ?`;
            values.push(`%${filters.description}%`);
        }
        if (filters.status) {
            query += ` AND status = ?`;
            values.push(filters.status);
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
        const validOrderColumns = ['id', 'projectName', 'description', 'startDate', 'createdAt', 'dueDate', 'status'];
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

        const countQuery = `SELECT COUNT(*) as total FROM projects WHERE 1=1` + query.split('ORDER BY')[0].slice(query.indexOf('WHERE'));
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
        logger.Error(error, { filepath: '/models/projectModel.js', function: 'getProjects' });
        console.log(error);
        throw error;
    }
};

const getProjectById = async (id) => {
    try {
        let query = `SELECT * FROM projects where id = ?`;
        let values = [id];
        const [result] = await pool.query(query, values);
        return {
            success: result.length > 0,
            data: result[0] || null
        };
    } catch (error) {
        logger.Error(error, { filepath: '/models/projectModel.js', function: 'getProjectById' });
        console.log(error)
        throw error;
    }
}

const createProject = async (data) => {
    try {
        const { projectName, description, status, startDate, dueDate } = data;
        if (!projectName) throw new Error('Project name is required');
        if (!status) throw new Error('Status is required');
        const query = `INSERT INTO projects (projectName, description, status, startDate, dueDate) VALUES (?, ?, ?, ?, ?)`;
        const values = [projectName, description, status, startDate, dueDate];
        const [result] = await pool.query(query, values);
        return {
            success: true,
            insertId: result.insertId,
            message: `Project '${projectName}' created successfully`
        };
    } catch (error) {
        logger.Error(error, { filepath: '/models/projectModel.js', function: 'createProject' });
        console.log(error)
        throw error;
    }
}

const updateProject = async (id, data) => {
    try {
        const { projectName, description, status, startDate, dueDate } = data;
        if (!projectName) throw new Error('Project name is required');
        if (!status) throw new Error('Status is required');
        let query = 'UPDATE projects SET projectName =?, description=?, status=?, startDate=?, dueDate=? where id=?';
        let values = [projectName, description, status, startDate, dueDate, id];
        const [result] = await pool.query(query, values);
        if (!result.affectedRows) return { success: false, message: `No project found with ID ${id}` };
        return {
            success: true,
            id: projectId,
            affectedRows: result.affectedRows,
            changedRows: result.changedRows
        };
    } catch (error) {
        logger.Error(error, { filepath: '/models/projectModel.js', function: 'updateProject' });
        console.log(error)
        throw error;
    }
}

const deleteProject = async (id) => {
    try {
        const query = `DELETE FROM projects WHERE id = ?`;
        const values = [id];
        const [result] = await pool.query(query, values);
        if (!result.affectedRow) {
            throw new Error(`No project found with ID ${id} to delete`);
        }

        return {
            success: true,
            message: `Project with ID ${id} deleted successfully`,
            affectedRows: result.affectedRows
        };
    } catch (error) {
        logger.Error(error, { filepath: '/models/projectModel.js', function: 'deleteProject' });
        console.log(error)
        throw error;
    }
}

export { createProjectTable, getProjects, getProjectById, createProject, updateProject, deleteProject };