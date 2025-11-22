// lib/db.js - Conexión a MySQL para Next.js
import mysql from 'mysql2/promise';

let connection = null;

export async function getConnection() {
    if (!connection) {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '1042849815',
            database: process.env.DB_NAME || 'marketplace_db',
        });
    }
    return connection;
}

export async function query(sql, params) {
    const conn = await getConnection();
    const [results] = await conn.execute(sql, params);
    return results;
}
