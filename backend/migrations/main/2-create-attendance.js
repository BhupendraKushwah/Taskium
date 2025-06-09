'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('attendance', {
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
            status: {
                type: Sequelize.ENUM('PRESENT', 'ABSENT', 'LATE', 'EXCUSED'),
                defaultValue: 'PRESENT',
                allowNull: false
            },
            date: {
                type: Sequelize.DATEONLY,
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
            },
        });

        await queryInterface.addIndex('attendance', ['userId', 'date'], {
            unique: true,
            name: 'unique_user_date',
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeIndex('attendance', 'unique_user_date');
        await queryInterface.dropTable('attendance');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_userAttendance_status";'); // only needed for PostgreSQL
    },
}