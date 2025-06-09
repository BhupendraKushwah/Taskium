'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('project', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            projectName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            image: {
                type: Sequelize.STRING,
            },
            status: {
                type: Sequelize.ENUM('Not Started', 'In Progress', 'Completed'),
                defaultValue: 'Not Started',
                allowNull: false,
            },
            focus: {
                type: Sequelize.STRING,
            },
            startDate: {
                type: Sequelize.DATE,
            },
            dueDate: {
                type: Sequelize.DATE,
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
            },
        });

        await queryInterface.addIndex('project', ['status']);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeIndex('project', ['status']);
        await queryInterface.dropTable('project');
    },
};
