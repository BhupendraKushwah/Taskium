const { Op } = require('sequelize');
const CONSTANTS = require('../config/constant');
const { getConnection } = require('../config/db');
const logger = require('../config/logger');
const projectDao = require('../dao/project.dao');
const teamDao = require('../dao/team.dao');
const { uploadImage } = require('../utils/upload');


const getProjectsData = async (req) => {
    try {
        let { models } = await getConnection();
        const { projectName, order_by = 'createdAt', order_direction = 'DESC', offset, limit } = req.query;
        let filters = {}
        if (projectName) {
            filters.projectName = {
                [Op.like]: `%${projectName}%`
            };
        }
        const response = await projectDao.getProjects(models, filters, {
            order: [[order_by, order_direction]],
            offset: parseInt(offset, 10),
            limit: parseInt(limit, 10)
        });
        return {
            status: CONSTANTS.HTTP_STATUS.OK,
            success: true,
            message: 'Projects fetched successfully',
            data: response.rows
        }
    } catch (error) {
        logger.Error(error, { filepath: '/controllers/projectController.js', function: 'getProjects' });
        throw error

    }
}
const addProject = async (req) => {
    try {
        const { models } = await getConnection();
        if (req.file) {
            let fileName = `project_${req.body.projectName}-${Date.now()}`;
            const buffer = req.file.buffer
            const [original, small, medium] = await Promise.all([
                uploadImage(buffer, {
                    public_id: fileName,
                    folder: 'taskium/project/large',
                    overwrite: true,
                }),
                uploadImage(buffer, {
                    public_id: fileName,
                    folder: 'taskium/project/small',
                    overwrite: true,
                    transformation: [{ width: 64, height: 82, crop: 'fill' }],
                }),
                uploadImage(buffer, {
                    public_id: fileName,
                    folder: 'taskium/project/medium',
                    overwrite: true,
                    transformation: [{ width: 80, height: 102, crop: 'fill' }],
                }),
            ]);
            const extension = req.file.mimetype.split('/')[1];
            req.body.image = `${fileName}.${extension}`;
        }
        else req.body.image = req.body.projectImage
        let response = await projectDao.createProject(models, req.body);
        if (!response) {
            return {
                status: CONSTANTS.HTTP_STATUS.FORBIDDEN,
                error: 'An error occurred while adding project'
            }
        }
        await Promise.all(req.body.teamMembers.map(async (member) => {
            const projectTeam = {
                projectId: response.id,
                userId: member.name,
                name: member.teamName,
                role: member.role
            };
            await teamDao.createTeam(models, projectTeam);
        }));

        return {
            status: CONSTANTS.HTTP_STATUS.OK,
            success: true,
            data: response,
            message: 'Project added successfully'
        }
    } catch (error) {
        logger.Error(error, { filepath: '/controllers/projectController.js', function: 'addProject' });
        console.log(error)
        throw error
    }
}

const deleteProjectById = async (req, res) => {
    try {
        let { models } = await getConnection();
        let response = await projectDao.deleteProject(models, { id: req.params.id });

        if (response) {
            return {
                status: CONSTANTS.HTTP_STATUS.OK,
                success: true,
                data: response,
                message: 'Project deleted successfully'
            }
        } else {
            return {
                status: CONSTANTS.HTTP_STATUS.NOT_FOUND,
                success: false,
                data: response,
                message: 'Project not found'
            }
        }
    } catch (error) {
        logger.Error(error, { filepath: '/controllers/projectController.js', function: 'deleteProjectById' });
        throw error
    }
}

const updateProject = async (req, res) => {
    try {

    } catch (error) {
        logger.Error(error, { filepath: '/controllers/projectController.js', function: 'updateProject' });
        throw error
    }
}

const searchProject = async (req, res) => {
    try {

    } catch (error) {
        logger.Error(error, { filepath: '/controllers/projectController.js', function: 'searchProject' });
        throw error
    }
}

module.exports = {
    addProject,
    getProjectsData,
    deleteProjectById,
    updateProject,
    searchProject
}