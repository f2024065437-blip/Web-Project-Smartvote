const { Pool } = require('pg');
require('dotenv').config();

// ✅ PostgreSQL (Neon)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const testConnection = async () => {
    try {
        const client = await pool.connect();
        await client.query('SELECT 1');
        client.release();
        console.log('✅ Database connected');
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
};

const executeQuery = async (sql, params = []) => {
    try {
        const result = await pool.query(sql, params);
        return { success: true, data: result.rows };
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
        const result = await pool.query(sql, params);
        return { success: true, id: result.rows[0]?.id || null };
    } catch (error) {
        console.error('❌ Insert error:', error.message);
        return { success: false, error: error.message };
    }
};

const updateRecord = async (sql, params = []) => {
    try {
        await pool.query(sql, params);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

module.exports = {
    pool,
    testConnection,
    executeQuery,
    getOne,
    insertOne,
    updateRecord
};