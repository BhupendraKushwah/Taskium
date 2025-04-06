import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function initializeDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.HOST,
            user: process.env.DB_USER,
            password: process.env.PASSWORD
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
        console.log(`Database '${process.env.DB_NAME}' is ready`);

        await connection.end();
    } catch (error) {
        console.error('Database Initialization Failed:', error);
        process.exit(1);
    }
}

async function createPool() {
    await initializeDatabase();

    const pool = mysql.createPool({
        host: process.env.HOST,
        user: process.env.DB_USER,
        password: process.env.PASSWORD,
        database: process.env.DB_NAME,
        dateStrings: true
    });

    try {
        const connection = await pool.getConnection();
        console.log('MySQL Connected Successfully');
        connection.release();
    } catch (error) {
        console.error('MySQL Connection Failed:', error);
        process.exit(1);
    }

    return pool;
}

export const getConnectionStatus = async ()=>{
    try {
        const [rows] = await pool.query("SELECT 1");
        if(rows.length) console.log("Database is connected")
    } catch (error) {
        console.log(error)
    }
}
const pool = await createPool();
export default pool;
