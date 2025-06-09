'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Project = sequelize.define('project', {
        projectName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.ENUM('Not Started', 'In Progress', 'Completed'),
            defaultValue: 'Not Started',
            allowNull: false
        },
        focus: {
            type: DataTypes.STRING,
        },
        startDate: {
            type: DataTypes.DATE,
        },
        dueDate: {
            type: DataTypes.DATE
        }
    }, {
        tableName: 'project',           // ✅ lowercase
        freezeTableName: true,         // ✅ prevent pluralization
        timestamps: true
    });

    Project.associate = function (models) {
        Project.hasMany(models.team, {
            foreignKey: 'projectId',
            as: 'teams', // important for `as: 'teams'` to work
            onDelete: 'CASCADE'
        });
    };
    

    return Project;
};
