const createProfession = async (models, data) => {
    return await models.professions.create(data);
}
const updateProfession = async (models, condition, data) => {
    return await models.professions.update(data, {
        where: {
            ...condition
        }
    })
}
const deleteProfession = async (models, condition = {}) => {
    return await models.professions.destroy({
        where: {
            ...condition
        }
    })
}
const getProfessionById = async (models, id) => {
    return await models.professions.findOne({
        where: {
            id
        }
    })
}
const getProfessions = async (models, options = {}) => {
    return await models.professions.findAndCountAll(options);
}

const getProfession = async (models, condition = {}) => {
    return await models.professions.findOne({ where: { ...condition } });
};


module.exports = {
    createProfession,
    updateProfession,
    deleteProfession,
    getProfessionById,
    getProfessions,
    getProfession
}