'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const User = sequelize.define('user', {
        name: {
            type: DataTypes.STRING,
            allowNull : false
        },
        email:{
            type: DataTypes.STRING,
            allowNull : false,
            unique : true,
            validate: { isEmail: true }
        },
        username:{
            type:DataTypes.STRING,
            allowNull : false,
            unique:true
        },
        password: {
            type: DataTypes.STRING,
            allowNull : false
        },
        gender:{
            type:DataTypes.ENUM('Male','Female'),
        },
        phone:{
            type:DataTypes.STRING
        },
        address:{
            type:DataTypes.TEXT
        },
        residence:{
            type:DataTypes.TEXT
        },
        dob:{
            type:DataTypes.DATE
        },
        passwordResetToken:{
            type:DataTypes.STRING
        },
        image:{
            type:DataTypes.STRING
        },
        fcm_token:{
            type:DataTypes.STRING
        }
    }, {
        tableName: 'users',
        timestamps: true,
        freezeTableName: true, // prevents pluralizing table name
      });
    User.associate = function (models) {User.hasMany(models.task, {
            as: 'assignedTo', // Alias for tasks where the user is assigned
            foreignKey: 'assignedTo', // Foreign key in the task table
        });

        // A user can have many tasks as the creator
        User.hasMany(models.task, {
            as: 'createdBy', // Alias for tasks where the user is the creator
            foreignKey: 'createdBy', // Foreign key in the task table
        }); }
    return User;
}