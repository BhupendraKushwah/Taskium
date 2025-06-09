'use strict';
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Notification = sequelize.define('notification', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isRead: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        url: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'notification',
        timestamps: true,
        freezeTableName: true
    });
    Notification.associate = function (models) {
        Notification.belongsTo(models.user, {
            foreignKey: 'userId',
            as: 'user', onDelete: 'CASCADE',
        })
    }
    return Notification;
}