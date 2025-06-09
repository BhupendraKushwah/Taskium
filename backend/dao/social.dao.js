const createSocial = async (models, data) => {
    return await models.social.create(data);
}
const updateSocial = async (models, condition, data) => {
    return await models.social.update(data,
        {
            where: {
                ...condition
            }
        });
}
const deleteSocial = async (models, condition = {}) => {
    return await models.social.destroy({
        where: {
            ...condition
        }
    })
}
const getSocialById = async (models, id) => {
    return await models.social.findOne({
        where: {
            id
        }
    })
}
const getSocials = async (models, options = {}) => {
    return await models.social.findAndCountAll(options);
}
const getSocial = async (models, condition) => {
    return await models.social.findOne({
        where: {
            ...condition
        }
    })
}

module.exports = {
    createSocial,
    updateSocial,
    deleteSocial,
    getSocialById,
    getSocials,
    getSocial
}