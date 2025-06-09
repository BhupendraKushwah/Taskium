const { Sequelize } = require('sequelize'); // make sure Sequelize is imported

const getNotifications = async (models, condition, limit, offset,order=[['createdAt', 'DESC']]) => {
    return await models.notification.findAndCountAll({
        where: {
            ...condition
        },
        include: [
            {
                model: models.user,
                as: 'user',
                attributes: []
            }
        ],
        attributes: {
            include: [
                [Sequelize.col('user.username'), 'username']
            ]
        },
        limit:limit ? Number(limit):10,
        offset: offset ?Number(offset):0,
        order:order,
        raw: true
    });
};






const markNotificationAsRead = async (models, condition, data) => {
    return await models.notification.update(data, {
        where: {
            ...condition
        }
    })
}

const deleteNotification = async (models, condition) => {
    return await models.notification.destroy({
        where: {
            ...condition
        }
    })
}
const getNotificationById = async (models, id) => {
    return await models.notification.findOne({
        where: { id }
    })
}
const insertNotification = async (models, data) => {
    return await models.notification.create(data);
}

module.exports = {
    getNotifications,
    markNotificationAsRead,
    deleteNotification,
    getNotificationById,
    insertNotification
}