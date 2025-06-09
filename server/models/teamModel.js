'use strict';
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Team = sequelize.define('team', {
        projectId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'team',
        timestamps: true,
        freezeTableName: true
    });
    Team.associate = function (models) {
        Team.belongsTo(models.project, {
            foreignKey: 'projectId',
            as: 'project',
        })
        Team.belongsTo(models.user, {
            foreignKey: 'userId',
            as: 'user', onDelete: 'CASCADE',
        })
    }
    return Team;
};