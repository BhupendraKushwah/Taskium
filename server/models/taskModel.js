'use strict';
const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    const Task = sequelize.define('task', {
        subject: {
            type: DataTypes.STRING,
            allowNull: false
        },
        assignedTo: {
            type: DataTypes.INTEGER
        },
        createdBy: {
            type: DataTypes.INTEGER
        },
        estimatedTime: {
            type: DataTypes.TIME
        },
        dueDate: {
            type: DataTypes.DATEONLY
        },
        priority: {
            type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
            allowNull: false,
            defaultValue: 'medium'
        },
        projectId: {
            type: DataTypes.INTEGER
        },
        status: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.TEXT
        },
        startDate: {
            type: DataTypes.DATEONLY
        },
        type: {
            type: DataTypes.STRING
        }
    }, {
        timestamps: true,
        tableName: 'tasks',
        freezeTableName: true,
    });
    Task.associate = function (models) {
        Task.belongsTo(models.user, {
            foreignKey: 'createdBy',
            as: 'createdByUser', onDelete: 'CASCADE',
        })
        Task.belongsTo(models.user, {
            foreignKey: 'assignedTo',
            as: 'assigneToUser', onDelete: 'CASCADE',
        })
        Task.belongsTo(models.project, {
            foreignKey: 'projectId',
            as: 'project', onDelete: 'CASCADE',
        })
    }

    return Task;
}