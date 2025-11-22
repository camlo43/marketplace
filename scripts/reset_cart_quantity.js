const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function resetCartQuantity() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '1042849815',
            database: 'marketplace_db'
        });

        console.log('Connected to DB. Resetting quantities...');

        const [result] = await connection.execute('UPDATE Carrito SET Cantidad = 1');
        console.log(`Updated ${result.affectedRows} rows to quantity 1.`);

        await connection.end();
    } catch (error) {
        console.error('Error:', error);
    }
}

resetCartQuantity();
