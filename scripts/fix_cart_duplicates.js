const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function fixCartDuplicates() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('Connected to DB. Cleaning duplicates...');

        // 1. Remove duplicates (keep the one with highest quantity or latest? Let's keep latest ID)
        // Actually, let's sum quantities? No, user wants 1.
        // Let's just keep the one with max ID.
        const deleteSql = `
            DELETE c1 FROM Carrito c1
            INNER JOIN Carrito c2 
            WHERE c1.ID < c2.ID 
            AND c1.UsuarioID = c2.UsuarioID 
            AND c1.ProductoID = c2.ProductoID;
        `;

        const [result] = await connection.execute(deleteSql);
        console.log(`Deleted ${result.affectedRows} duplicate rows.`);

        // 2. Add Unique Constraint
        console.log('Adding UNIQUE constraint...');
        try {
            await connection.execute('ALTER TABLE Carrito ADD UNIQUE KEY unique_cart_item (UsuarioID, ProductoID)');
            console.log('Constraint added successfully.');
        } catch (err) {
            if (err.code === 'ER_DUP_KEYNAME') {
                console.log('Constraint already exists.');
            } else {
                throw err;
            }
        }

        await connection.end();
    } catch (error) {
        console.error('Error:', error);
    }
}

fixCartDuplicates();
