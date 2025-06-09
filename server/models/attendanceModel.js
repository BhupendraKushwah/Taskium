'use strict';
const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    const UserAttendance = sequelize.define('attendance', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('PRESENT', 'ABSENT', 'LATE', 'EXCUSED'),
            defaultValue: 'PRESENT',
            allowNull: false
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        }
    }, {
        tableName: 'attendance',
        timestamps: true,
        freezeTableName: true,
        indexes: [
            {
                unique: true,
                fields: ['userId', 'date']
            }
        ]
    })
    UserAttendance.associate = function (models) {
        UserAttendance.belongsTo(models.user, {
            foreignKey: 'userId',
            as: 'user', onDelete: 'CASCADE',
        })
    }
    return UserAttendance
}