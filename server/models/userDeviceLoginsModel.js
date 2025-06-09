'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const UserDeviceLogins = sequelize.define('userDeviceLogins', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        deviceId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        deviceType: {
            type: DataTypes.ENUM('MOBILE', 'DESKTOP', 'TABLET', 'OTHER'),
            defaultValue: 'OTHER',
            allowNull: false
        },
        osName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        osVersion: {
            type: DataTypes.STRING,
            allowNull: true
        },
        browserName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        browserVersion: {
            type: DataTypes.STRING,
            allowNull: true
        },
        ipAddress: {
            type: DataTypes.STRING,
            allowNull: false
        },
        loginTime: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        },
        logoutTime: {
            type: DataTypes.DATE,
            allowNull: true
        },
        lastActive: {
            type: DataTypes.DATE,
            allowNull: true
        },
        sessionToken: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        status: {
            type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
            defaultValue: 'ACTIVE',
            allowNull: false
        }
    }, {
        tableName: 'userDeviceLogins',
        timestamps: true,
        freezeTableName: true,
        indexes: [
            {
                unique: true,
                fields: ['userId', 'deviceId']
            }
        ]
    });

    UserDeviceLogins.associate = function (models) {
        UserDeviceLogins.belongsTo(models.user, {
            foreignKey: 'userId',
            as: 'user',
            onDelete: 'CASCADE'
        });
    };

    return UserDeviceLogins;
};
