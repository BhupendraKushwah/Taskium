import logger from "../config/logger.js";
import pool from "../config/db.js";
import CONSTANTS from "../config/constant.js";

const createProjectTable = async () => {
    try {
        const query = `CREATE TABLE IF NOT EXISTS projects (
                        id INT PRIMARY KEY AUTO_INCREMENT,
                        projectName VARCHAR(255) NOT NULL,
                        image VARCHAR(255),
                        status ENUM('Not Started', 'In Progress', 'Completed') NOT NULL DEFAULT 'Not Started',
                        focus VARCHAR(255),
                        startDate DATE,
                        dueDate DATE,
                        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                    );`;
        const teamQuery = `
                    CREATE TABLE IF NOT EXISTS team (
                        id INT PRIMARY KEY AUTO_INCREMENT,
                        projectId INT NOT NULL,
                        userId INT,
                        name VARCHAR(255) NOT NULL, 
                        role VARCHAR(255) NOT NULL, 
                        FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE,
                        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL, -- Assumes users table
                        INDEX idx_projectId (projectId) -- Index for joins
                    )`;
        await pool.query(query);
        await pool.query(teamQuery);
        return { success: true, message: 'Project table created successfully' };
    } catch (error) {
        logger.Error(error, { filepath: '/models/projectModel.js', function: 'createProjectTable' });
        throw error;
    }
}

const getProjects = async (filters = {}, order_by = 'p.createdAt', order_direction = 'DESC', offset = 0) => {
    try {
        let query = `
          SELECT  p.id, p.projectName, p.focus, p.image, p.status, p.startDate, p.dueDate,p.createdAt,
            IF(
        COUNT(t.id) > 0,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'name', u.name,
                'role', t.role
            )
        ),
        JSON_ARRAY()
          ) AS teamMembers
            FROM projects p
            LEFT JOIN team t ON p.id = t.projectId
            LEFT JOIN users u ON u.id = t.name
            WHERE 1=1
        `;
        let values = [];

        // Dynamically build query based on available filters
        if (filters.projectName) {
            query += ` AND p.projectName LIKE ?`;
            values.push(`%${filters.projectName}%`);
        }
        if (filters.focus) {
            query += ` AND p.focus LIKE ?`;
            values.push(`%${filters.focus}%`);
        }
        if (filters.status) {
            query += ` AND p.status = ?`;
            values.push(filters.status);
        }
        if (filters.startDate) {
            query += ` AND p.startDate >= ?`;
            values.push(filters.startDate);
        }
        if (filters.dueDate) {
            query += ` AND p.dueDate <= ?`;
            values.push(filters.dueDate);
        }
        if (filters.createdAt) {
            query += ` AND p.createdAt >= ?`;
            values.push(filters.createdAt);
        }

        // Prevent SQL injection by allowing only specific columns for ordering
        const validOrderColumns = ['id', 'projectName', 'focus', 'startDate', 'createdAt', 'dueDate', 'status'];
        if (!validOrderColumns.includes(order_by)) {
            order_by = 'p.createdAt'; // Default fallback
        }

        query += ` GROUP BY p.id`;

        // Ensure order direction is either ASC or DESC
        order_direction = order_direction.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        // Add ordering and pagination (LIMIT and OFFSET) to the query
        query += ` ORDER BY ${order_by} ${order_direction} LIMIT ? OFFSET ?`;
        let limit = CONSTANTS.PAGINATION.DEFAULT_LIMIT;
        values.push(limit, offset);

        const [results] = await pool.query(query, values);

        const countQuery = `SELECT COUNT(*) as total ` + query.slice(
            query.indexOf('FROM'),
            query.indexOf('ORDER BY')
        );

        // Use only the filter values (exclude LIMIT and OFFSET)
        const [countResult] = await pool.query(countQuery, values.slice(0, -2));
        const total = countResult[0]?.total;

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
        throw error;
    }
};

const getProjectById = async (id) => {
    try {
        let query = `SELECT  p.id, p.projectName, p.focus, p.image, p.status, p.startDate, p.dueDate,p.createdAt,
            IF(
        COUNT(t.id) > 0,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'name', u.name,
                'role', t.role
            )
        ),
        JSON_ARRAY()
          ) AS teamMembers
            FROM projects p
            LEFT JOIN team t ON p.id = t.projectId
            LEFT JOIN users u ON u.id = t.name
            WHERE p.id = ?
            GROUP BY p.id`
            ;
        let values = [id];
        const [result] = await pool.query(query, values);
        return {
            success: result.length > 0,
            data: result[0] || null
        };
    } catch (error) {
        logger.Error(error, { filepath: '/models/projectModel.js', function: 'getProjectById' }); throw error;
    }
}

const createProject = async (data) => {
    try {
        let { projectName, image, focus, status, startDate, dueDate, teamMembers = [] } = data;
        image = image || null;
        if (!projectName) throw new Error('Project name is required');
        if (!status) throw new Error('Status is required');
        const query = `INSERT INTO projects (projectName, image, focus, status, startDate, dueDate) VALUES (?, ?, ?, ?, ?,?)`;
        const values = [projectName, image, focus, status, startDate, dueDate];
        const [result] = await pool.query(query, values);
        let projectId = result.insertId;
        for (const member of teamMembers) {
            const teamQuery = `
                INSERT INTO team (projectId, name, role)
                VALUES (?, ?, ?)`;
            const teamValues = [projectId, member.name, member.role];
            await pool.query(teamQuery, teamValues);
        }
        let project = await getProjectById(projectId);
        return {
            success: true,
            insertId: result.insertId,
            project: project.data,
            message: `Project '${projectName}' created successfully`
        };
    } catch (error) {
        logger.Error(error, { filepath: '/models/projectModel.js', function: 'createProject' });
        throw error;
    }
}

const updateProject = async (id, data) => {
    try {
        const { projectName, focus, status, startDate, dueDate } = data;
        if (!projectName) throw new Error('Project name is required');
        if (!status) throw new Error('Status is required');
        let query = 'UPDATE projects SET projectName =?, focus=?, status=?, startDate=?, dueDate=? where id=?';
        let values = [projectName, focus, status, startDate, dueDate, id];
        const [result] = await pool.query(query, values);
        if (!result.affectedRows) return { success: false, message: `No project found with ID ${id}` };
        return {
            success: true,
            id: projectId,
            affectedRows: result.affectedRows,
            changedRows: result.changedRows
        };
    } catch (error) {
        logger.Error(error, { filepath: '/models/projectModel.js', function: 'updateProject' }); throw error;
    }
}

const deleteProject = async (id) => {
    try {
        const query = `DELETE FROM projects WHERE id = ?`;
        const values = [id];
        const [result] = await pool.query(query, values);
        if (!result.affectedRows) {
            throw new Error(`No project found with ID ${id} to delete`);
        }

        return {
            success: true,
            message: `Project with ID ${id} deleted successfully`,
            affectedRows: result.affectedRows
        };
    } catch (error) {
        logger.Error(error, { filepath: '/models/projectModel.js', function: 'deleteProject' }); throw error;
    }
}

export { createProjectTable, getProjects, getProjectById, createProject, updateProject, deleteProject };