'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('userDeviceLogins', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            deviceId: {
                type: Sequelize.STRING,
                allowNull: false
            },
            deviceType: {
                type: Sequelize.ENUM('MOBILE', 'DESKTOP', 'TABLET', 'OTHER'),
                defaultValue: 'OTHER',
                allowNull: false
            },
            osName: {
                type: Sequelize.STRING,
                allowNull: true
            },
            osVersion: {
                type: Sequelize.STRING,
                allowNull: true
            },
            browserName: {
                type: Sequelize.STRING,
                allowNull: true
            },
            browserVersion: {
                type: Sequelize.STRING,
                allowNull: true
            },
            ipAddress: {
                type: Sequelize.STRING,
                allowNull: false
            },
            loginTime: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW'),
                allowNull: false
            },
            logoutTime: {
                type: Sequelize.DATE,
                allowNull: true
            },
            lastActive: {
                type: Sequelize.DATE,
                allowNull: true
            },
            sessionToken: {
                type: Sequelize.STRING,
                allowNull: true,
                unique: true
            },
            status: {
                type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
                defaultValue: 'ACTIVE',
                allowNull: false
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW'),
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW'),
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('userDeviceLogins');
    }
};