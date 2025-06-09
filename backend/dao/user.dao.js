const createUser = async (models, data) => {
    return await models.user.create(data);
}

const updateUser = async (models, condition, data) => {
    return await models.user.update(data, {
        where: {
            ...condition
        }
    })

}

const deleteUserById = async (models, id) => {
    return await models.user.destroy({
        where: { id }
    });
}

const deleteAllUser = async (models) => {
    return await models.user.destroy({
        where: {}
    });
}

const getUserById = async (models, id) => {
    return await models.user.findOne({
        where: { id }
    });
}

const getAllUsers = async (models, options) => {
    return await models.user.findAndCountAll(options);
};
const getUserByCondition = async (models, condition) => {
    
    return await models.user.findOne({
        where: {
            ...condition
        }
    })

}


module.exports = {
    createUser,
    updateUser,
    deleteUserById,
    deleteAllUser,
    getUserById,
    getAllUsers,
    getUserByCondition
}