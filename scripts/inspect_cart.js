const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function inspectCart() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        const [rows] = await connection.execute('SELECT * FROM Carrito');
        console.log('Current Carrito Table Content:');
        console.table(rows);

        const [products] = await connection.execute('SELECT ID, Nombre FROM Productos WHERE ID IN (SELECT ProductoID FROM Carrito)');
        console.log('Products in Cart:');
        console.table(products);

        await connection.end();
    } catch (error) {
        console.error('Error:', error);
    }
}

inspectCart();
