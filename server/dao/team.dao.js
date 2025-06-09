const createTeam = async (models, team) => {
    return await models.team.create(team);
};

const updateTeam = async (models, condition, data) => {
    return await models.team.update(data, {
        where: condition
    });
};

const deleteTeamById = async (models, id) => {
    return await models.team.destroy({
        where: { id }
    });
};

const getTeamById = async (models, id) => {
    return await models.team.findOne({
        where: { id }
    });
};

const getTeamByCondition = async (models, condition) => {
    return await models.team.findOne({
        where: condition
    });
}
const getAllTeams = async (models, options = {}) => {
    return await models.team.findAndCountAll(options);
};

const deleteAllTeams = async (models) => {
    return await models.team.destroy({
        where: {}
    });
};

module.exports = {
    createTeam,
    updateTeam,
    deleteTeamById,
    getTeamById,
    getTeamByCondition,
    getAllTeams,
    deleteAllTeams
};
