const fs = require('fs');
const path = require('path');
const {initSequelize} = require('../config/db');
async function runMigrations() {
    const migrationsPath = path.resolve(__dirname, './main');
    const migrationFiles = fs.readdirSync(migrationsPath).filter((file) => file.endsWith('.js'));
    const sequelize = await initSequelize(); 
    for (const file of migrationFiles) {
        console.log(`Running migration: ${file}`);
        const migration = require(path.join(migrationsPath, file));
        await migration.up(sequelize.getQueryInterface(), sequelize.constructor);
        console.log(`Migration completed: ${file}`);
    }
    process.exit(1);
}
runMigrations()