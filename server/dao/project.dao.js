const getProjects = async (models, condition={}, options = {}) => {

    return await models.project.findAndCountAll({
        where: {
            ...condition
        },
        include: [
            {
                model: models.team,
                as: 'teams', // only if you defined alias 'teams' in project model
                include: [
                    {
                        model: models.user,
                        as: 'user'
                    }
                ]
            }
        ],
        ...options,
    });
};



const getProjectById = async (models,id) => {
    return await models.project.findOne({
        where:{id}
    })
}

const createProject = async (models,data) => {
    return await models.project.create(data)
}

const updateProject = async (models,condition,data) => {
    return await models.project.update(data, {
        where: {
            ...condition
        }
    })
}

const deleteProject = async (models,condition) => {
    return await models.project.destroy({
        where: {
            ...condition
        }
    })
}

module.exports = {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
};