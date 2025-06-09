'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Professions = sequelize.define('professions', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        designation: {
            type: DataTypes.STRING,
            allowNull: false
        },
        company: {
            type: DataTypes.STRING,
            allowNull: false
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'professions',
        timestamps: true,
        freezeTableName: true,
        indexes: [
            {
                unique: true,
                fields: ['userId', 'email']
            }
        ]
    });
    Professions.associate = function (models) {
        Professions.belongsTo(models.user, {
            foreignKey: 'userId',
            as: 'user', onDelete: 'CASCADE',
        })
    }
    return Professions;
}
