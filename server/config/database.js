const mysql = require('mysql2');
require('dotenv').config();

// Check if using PostgreSQL (Neon)
const isPostgres = process.env.DATABASE_URL && process.env.DATABASE_URL.includes('postgresql');

let pool;

if (isPostgres) {
    // PostgreSQL (Neon)
    const { Pool } = require('pg');
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
} else {
    // MySQL
    pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'smartvote_db',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
}

const promisePool = pool.promise ? pool.promise() : pool;

const testConnection = async () => {
    try {
        if (isPostgres) {
            const client = await pool.connect();
            await client.query('SELECT 1');
            client.release();
        } else {
            await promisePool.query('SELECT 1');
        }
        console.log('✅ Database connected');
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
};

const executeQuery = async (sql, params = []) => {
    try {
        if (isPostgres) {
            const result = await pool.query(sql, params);
            return { success: true, data: result.rows };
        } else {
            const [rows] = await promisePool.query(sql, params);
            return { success: true, data: rows };
        }
    } catch (error) {
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
        if (isPostgres) {
            const result = await pool.query(sql + ' RETURNING id', params);
            return { success: true, id: result.rows[0].id };
        } else {
            const [result] = await promisePool.query(sql, params);
            return { success: true, id: result.insertId };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
};

const updateRecord = async (sql, params = []) => {
    try {
        if (isPostgres) {
            await pool.query(sql, params);
        } else {
            await promisePool.query(sql, params);
        }
        return { success: true };
    } catch (error) {
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