import CONSTANTS from "../config/constant.js";
import logger from "../config/logger.js"
import { createProject, deleteProject, getProjects } from "../models/projectModel.js";
import { uploadImage } from "../utils/upload.js";


const getProjectsData = async (req, res) => {
    try {
        const {filters,order_by = 'p.createdAt', order_direction = 'DESC', offset} = req.query;
        
        let response = await getProjects(filters,order_by,order_direction,Number(offset));
        res.status(CONSTANTS.HTTP_STATUS.OK).json({
            success: true,
            data: response.data,
            message: 'Projects fetched successfully'
        })
    } catch (error) {
        logger.Error(error, { filepath: '/controllers/projectController.js', function: 'getProjects' });
        res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message || 'Internal server error' });
    }
}
const addProject = async (req, res) => {
    try {
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
        
        let response = await createProject(req.body);
        if(!response.success){
            return res.status(CONSTANTS.HTTP_STATUS.FORBIDDEN).json({ error: 'An error occurred' })
        }
        res.status(CONSTANTS.HTTP_STATUS.OK).json({
            success: true,
            data: response,
            message: 'Project added successfully'
        })
    } catch (error) {
        logger.Error(error, { filepath: '/controllers/projectController.js', function: 'addProject' });
        res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message || 'Internal server error' });
    }
}

const deleteProjectById = async (req, res) => {
    try {
        let response = await deleteProject(req.params.id);
        if (response.success) {
            res.status(CONSTANTS.HTTP_STATUS.OK).json({
                success: true,
                data: response,
                message: 'Project deleted successfully'
            })
        } else {
            res.status(CONSTANTS.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                data: response,
                message: 'Project not found'
            })
        }
    } catch (error) {
        logger.Error(error, { filepath: '/controllers/projectController.js', function: 'deleteProjectById' });
        res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message || 'Internal server error' });
    }
}

const updateProject = async (req, res) => {
    try {

    } catch (error) {
        logger.Error(error, { filepath: '/controllers/projectController.js', function: 'updateProject' });
        res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message || 'Internal server error' });
    }
}

const searchProject = async (req, res) => {
    try {

    } catch (error) {
        logger.Error(error, { filepath: '/controllers/projectController.js', function: 'searchProject' });
        res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message || 'Internal server error' });
    }
}

export {
    addProject,
    getProjectsData,
    deleteProjectById,
    updateProject,
    searchProject
}