'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('social', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users', // Adjust table name if different
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },
            facebook: {
                type: Sequelize.STRING,
                allowNull: true
            },
            x: {
                type: Sequelize.STRING,
                allowNull: true
            },
            linkedin: {
                type: Sequelize.STRING,
                allowNull: true
            },
            github: {
                type: Sequelize.STRING,
                allowNull: true
            },
            instagram: {
                type: Sequelize.STRING,
                allowNull: true
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
        await queryInterface.dropTable('social');
    }
};