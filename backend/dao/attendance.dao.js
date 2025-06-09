const getUserAttendance = async (models, condition) => {
    return await models.attendance.findAndCountAll({
        where: {
            ...condition
        }
    })
}

const insertUserAttendance = async (models, data) => {
    return await models.attendance.create(data);
}
module.exports = {
    getUserAttendance,
    insertUserAttendance
}