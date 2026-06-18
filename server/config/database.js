const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'smartvote_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

const testConnection = async () => {
    try {
        await promisePool.query('SELECT 1');
        console.log('✅ MySQL Database connected');
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
};

const executeQuery = async (sql, params = []) => {
    try {
        const [rows] = await promisePool.query(sql, params);
        return { success: true, data: rows };
    } catch (error) {
        console.error('Query error:', error.message);
        return { success: false, error: error.message };
    }
};

const getOne = async (sql, params = []) => {
    const result = await executeQuery(sql, params);
    if (result.success && result.data.length > 0) {
        return { success: true, data: result.data[0] };
    }
    return { success: false, data: null };
};

const insertOne = async (sql, params = []) => {
    try {
        const [result] = await promisePool.query(sql, params);
        return { success: true, id: result.insertId };
    } catch (error) {
        console.error('Insert error:', error.message);
        return { success: false, error: error.message };
    }
};

const updateRecord = async (sql, params = []) => {
    try {
        const [result] = await promisePool.query(sql, params);
        return { success: true, affectedRows: result.affectedRows };
    } catch (error) {
        console.error('Update error:', error.message);
        return { success: false, error: error.message };
    }
};

module.exports = {
    pool,
    promisePool,
    testConnection,
    executeQuery,
    getOne,
    insertOne,
    updateRecord
};