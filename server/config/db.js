const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
dotenv.config();

const {
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST = 'localhost',
  DB_PORT = 3306,
} = process.env;
let sequelizeInstances = {};
const createDatabaseIfNotExists = async () => {
  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    ssl: {
      rejectUnauthorized: true
    }
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
  await connection.end();
};

let sequelize;

const initSequelize = async () => {
  try {
    await createDatabaseIfNotExists();

    sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
      host: DB_HOST,
      dialect: 'mysql',
      port: DB_PORT,
      logging: false,
      dialectOptions: {
        ssl: {
          rejectUnauthorized: true
        }
      }
    });

    await sequelize.authenticate();
    console.log('✅ Database connection established');

    return sequelize;
  } catch (error) {
    console.error('❌ Error connecting to database:', error.message);
    console.log(DB_NAME,
      DB_USER,
      DB_PASSWORD,
      DB_HOST,
      DB_PORT);

    process.exit(1);
  }
};
async function getConnection() {
  const databaseName = DB_NAME;
  if (!sequelizeInstances[databaseName]) {
    const sequelize = await initSequelize(); // Get Sequelize instance

    const models = {};
    const modelsPath = path.resolve(__dirname, '../models');
    const modelFiles = fs.readdirSync(modelsPath).filter(file => file.endsWith('.js'));

    // Load each model and run the model factory
    for (const file of modelFiles) {
      const modelDef = require(path.join(modelsPath, file));
      const model = modelDef(sequelize); // run factory function
      models[model.name] = model;
    }

    // Run associations
    Object.values(models)
      .filter(model => typeof model.associate === 'function')
      .forEach(model => model.associate(models));

    // Attach models to Sequelize
    sequelize.models = models;

    // Cache this instance
    sequelizeInstances[databaseName] = sequelize;
  }

  return sequelizeInstances[databaseName];
}
module.exports = {
  initSequelize,
  getConnection
};
