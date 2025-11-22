import mysql from 'mysql2/promise';

export const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1042849815', // la que pusiste en mysql_secure_installation
    database: 'marketplace_db'
});
