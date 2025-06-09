const createSession = async (models, data) => {
    return await models.userDeviceLogins.create(data);
}

const findSessionByToken = async (models, token) => {
    return await models.userDeviceLogins.findOne({
        where: {
            sessionToken:token
        }
    })
}

const deleteSessionByToken = async (models, token) => {
    return await models.userDeviceLogins.destroy({
        where: {
            sessionToken:token
        }
    })
}
const getLoginDevices = async (models, condition,sortBy='DESC',sortField = 'createdAt') => {
    return await models.userDeviceLogins.findAll({
        where: {
            ...condition
        },
        order: [
            [sortField, sortBy]
        ],
        raw: true,

    })
}
module.exports = {
    createSession,
    findSessionByToken,
    deleteSessionByToken,
    getLoginDevices
}