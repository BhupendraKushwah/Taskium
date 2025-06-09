const { Op } = require('sequelize');
const CONSTANTS = require('../config/constant');
const { getConnection } = require('../config/db');
const logger = require('../config/logger');
const taskDao = require('../dao/task.dao')

const addTask = async (req) => {
    try {
        const { models } = await getConnection();

        let taskData = {
            subject: req.body.subject,
            projectId: req.body.project?.value,
            assignedTo: req.body.assignTo?.value,
            createdBy: req.body.createdBy,
            estimatedTime: req.body.estimatedTime,
            dueDate: req.body.dueDate,
            priority: req.body.priority?.value,
            status: req.body.status?.value,
            description: req.body.description,
            startDate: req.body.startDate,
            type: req.body.type?.value
        }
        let response = await taskDao.createTask(models, taskData);
        if (response) {
            return {
                status: CONSTANTS.HTTP_STATUS.OK,
                success: true,
                message: 'Task created successfully',
                data: response
            }
        }
    } catch (error) {
        logger.Error(error, { filepath: '/controllers/taskController.js', function: 'createTask' });
        return { status: CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR, error: error.message || 'Internal server error' };
    }
}

const removeTask = async (req) => {
    try {
        const { models } = await getConnection();
        const { id } = req.query
        let response = await taskDao.deleteTask(models, id);
        if (response) {
            return {
                status: CONSTANTS.HTTP_STATUS.OK,
                success: true,
                message: 'Task deleted successfully',
                data: response
            }
        }
    } catch (error) {
        logger.Error(error, { filepath: '/controllers/taskController.js', function: 'deleteTask' });
        return { status: CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR, error: error.message || 'Internal server error' };
    }
}

const getAllTasks = async (req) => {
    try {
        const { models } = await getConnection();
        const { filters = {}, order, column, limit, offset } = req.query;
        let order_by = column || 'createdAt';
        let order_direction = order || 'DESC';
        let taskFilter;
        if (Object.keys(filters).length) {
            taskFilter = {
                [Op.and]: [
                    ...(filters.subject && typeof filters.subject === 'string' ? [{ subject: { [Op.like]: `%${filters.subject}%` } }] : []),
                    ...(filters.status && typeof filters.status === 'string' ? [{ status: { [Op.like]: `%${filters.status}%` } }] : []),
                    ...(filters.creator ? [{ createdBy: Number(filters.creator) }] : []),
                    ...(filters.projectName ? [{ projectId: Number(filters.projectName) }] : []),
                    ...(filters.dueDate ? [{ dueDate: filters.dueDate }] : []),
                    ...(filters.startDate ? [{ startDate: filters.startDate }] : []),
                    ...(filters.Type ? [{ Type: filters.Type }] : []),
                    ...(filters.Status ? [{ status: filters.Status.toLowerCase() }] : []),
                    ...(filters.priority ? [{ priority: filters.priority.toLowerCase() }] : []),
                    ...(filters.assignee ? [{ assignedTo: Number(filters.assignee) }] : [])
                ]
            };
        }

        // Determine the order clause based on the column
        let orderOption;
        if (column === 'assignee') {
            orderOption = [[{ model: models.user, as: 'assigneToUser' }, 'name', order_direction]];
        } else if (column === 'creator') {
            orderOption = [[{ model: models.user, as: 'createdByUser' }, 'name', order_direction]];
        } else if (column === 'projectName') {
            orderOption = [[{ model: models.project, as: 'project' }, 'projectName', order_direction]];
        } else {
            orderOption = [[order_by, order_direction]];
        }

        let { rows: response } = await taskDao.getTasks(models, taskFilter, {
            order: orderOption,
            limit: parseInt(limit, 10) || 10,
            offset: parseInt(offset, 10) || 0,
            include: [
                {
                    model: models.user,
                    as: 'assigneToUser',
                    attributes: ['name']
                },
                {
                    model: models.user,
                    as: 'createdByUser',
                    attributes: ['name']
                },
                {
                    model: models.project,
                    as: 'project',
                    attributes: ['projectName']
                }
            ]
        });
        let responseData = response.map(item => ({
            ...item.dataValues,
            assignee: item.dataValues.assigneToUser?.name,
            creator: item.dataValues.createdByUser?.name,
            projectName: item.dataValues.project?.projectName
        }));

        return {
            status: CONSTANTS.HTTP_STATUS.OK,
            success: true,
            message: 'Tasks fetched successfully',
            data: responseData
        };
    } catch (error) {
        logger.Error(error, { filepath: '/controllers/taskController.js', function: 'getAllTasks' });
        return { status: CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR, error: error.message || 'Internal server error' };
    }
};

const findTaskById = async (req, res) => {
    try {
        return await getTask(req.params.id);
    } catch (error) {
        logger.Error(error, { filepath: '/controllers/taskController.js', function: 'getTask' });
        res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message || 'Internal server error' });
    }
}

const editTask = async (req) => {
    try {
        const { models } = await getConnection();
        const { id, data } = req.body;
        let taskData = {
            subject: data.subject,
            projectId: data.project?.value,
            assignedTo: data.assignTo?.value,
            createdBy: data.createdBy,
            estimatedTime: data.estimatedTime,
            dueDate: data.dueDate,
            priority: data.priority?.value,
            status: data.status?.value,
            description: data.description,
            startDate: data.startDate,
            type: data.type?.value
        }
        let response = await taskDao.updateTask(models, id, taskData)
        console.log(response)
        if (!response) {
            return {
                status: CONSTANTS.HTTP_STATUS.NOT_FOUND,
                success: false,
                message: 'Task not found',
            }
        }
        return {
            status: CONSTANTS.HTTP_STATUS.OK,
            success: true,
            message: 'Task updated successfully',
        }

    } catch (error) {
        logger.Error(error, { filepath: '/controllers/taskController.js', function: 'editTask' });
        return { status: CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR, error: error.message || 'Internal server error' };
    }
}

const updateTaskStatus = async (req, res) => {
    try {
        const { models } = await getConnection();
        const { id, status } = req.body;
        let response = await taskDao.updateTask(models, id, { status })
        if (!response) {
            return {
                status: CONSTANTS.HTTP_STATUS.NOT_FOUND,
                success: false,
                message: 'Task not found',
            }
        }
        return {
            status: CONSTANTS.HTTP_STATUS.OK,
            success: true,
            message: 'Task status updated successfully',
        }
    } catch (error) {
        logger.Error(error, { filepath: '/controllers/taskController.js', function: 'updateTaskStatus' });
        return { status: CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR, error: error.message || 'Internal server error' };

    }
}
const dashboardTask = async (req, res) => {
    try {
        const { models } = await getConnection();
        const today = new Date().toLocaleDateString('en-CA');
        let { rows: todayTask } = await taskDao.getTasks(models, {dueDate: today}, {});
        let { rows: pendingTask } = await taskDao.getTasks(models, 
            {
                dueDate:{[Op.ne]: today},
                status:{[Op.ne]: 'closed'}
            }, {});
        return {
            status: CONSTANTS.HTTP_STATUS.OK,
            success: true,
            message: 'Tasks fetched successfully',
            data: {todayTask,pendingTask}
        }
    } catch (error) {
        logger.Error(error, { filepath: '/controllers/taskController.js', function: 'dashboardTask' });
        return { status: CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR, error: error.message || 'Internal server error' };

    }
}
module.exports = {
    addTask,
    removeTask,
    getAllTasks,
    findTaskById,
    editTask,
    updateTaskStatus,
    dashboardTask
}