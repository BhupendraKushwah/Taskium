'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tasks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      subject: {
        type: Sequelize.STRING,
        allowNull: false
      },
      assignedTo: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users', // Adjust this if your user table is named differently
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      createdBy: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      estimatedTime: {
        type: Sequelize.TIME
      },
      dueDate: {
        type: Sequelize.DATEONLY
      },
      priority: {
        type: Sequelize.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: false,
        defaultValue: 'medium'
      },
      projectId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'project', // Adjust if needed
          key: 'id'
        }
      },
      status: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      startDate: {
        type: Sequelize.DATEONLY
      },
      type: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tasks');
  }
};
