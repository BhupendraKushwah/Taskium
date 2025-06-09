const getTasks = async (models, condition, options = {}) => {
    return await models.task.findAndCountAll({
        where: {
            ...condition
        },
        ...options,
    });
};


const getTaskById = async (models, id) => {
    return await models.task.findOne({
        where: {
            id
        }
    })
}

const createTask = async (models, task) => {
    return await models.task.create(task);
}

const updateTask = async (models, id, task) => {
    return await models.task.update(task, {
        where: {
            id
        }
    })
}

const deleteTask = async (models, id) => {
    return await models.task.destroy({
        where: {
            id
        }
    })
}

const updateTaskStatus = async (models, id, status) => {
    return await models.task.update({ status }, {
        where: {
            id
        }
    })
}

module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus
}