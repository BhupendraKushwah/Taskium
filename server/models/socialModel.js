'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Social = sequelize.define('social', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        facebook: {
            type: DataTypes.STRING,
            allowNull: true
        },
        x: {
            type: DataTypes.STRING,
            allowNull: true
        },
        linkedin: {
            type: DataTypes.STRING,
            allowNull: true
        },
        instagram: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'social',
        timestamps: true,
        freezeTableName: true
    });
    Social.associate = function (models) {
        Social.belongsTo(models.user, {
            foreignKey: 'userId',
            as: 'user', onDelete: 'CASCADE',
        })
    }
    return Social;
}