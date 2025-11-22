import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/cart - Get cart items for a user
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        const sql = `
            SELECT 
                c.ID as CartID,
                c.ProductoID,
                c.Cantidad,
                p.*,
                GROUP_CONCAT(f.Ruta ORDER BY f.Orden ASC SEPARATOR ',') as Imagenes
            FROM Carrito c
            JOIN Productos p ON c.ProductoID = p.ID
            LEFT JOIN FotosProducto f ON p.ID = f.ProductoID
            WHERE c.UsuarioID = ?
            GROUP BY c.ID, c.ProductoID
        `;

        const items = await query(sql, [userId]);

        return NextResponse.json(items);
    } catch (error) {
        console.error('Error fetching cart:', error);
        return NextResponse.json({ error: 'Error fetching cart' }, { status: 500 });
    }
}

// POST /api/cart - Add item to cart
export async function POST(request) {
    try {
        const body = await request.json();
        const { userId, productId, quantity } = body;

        console.log('POST /api/cart Request:', { userId, productId, quantity });
        console.log('DB Config Check:', {
            host: process.env.DB_HOST || 'localhost (default)',
            user: process.env.DB_USER || 'root (default)',
            database: process.env.DB_NAME || 'marketplace_db (default)'
        });

        if (!userId || !productId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Check if item exists
        const existing = await query(
            'SELECT ID, Cantidad FROM Carrito WHERE UsuarioID = ? AND ProductoID = ?',
            [userId, productId]
        );

        if (existing.length > 0) {
            // 2. Update existing
            // For now, let's just increment. 
            // If the user wants to set absolute quantity, we should use PUT.
            // But to fix the "x10" bug, let's be very careful.
            // Let's just ADD the new quantity (usually 1).
            const newQuantity = existing[0].Cantidad + (quantity || 1);
            console.log(`Updating item ${existing[0].ID}. Old Qty: ${existing[0].Cantidad}, New Qty: ${newQuantity}`);

            await query(
                'UPDATE Carrito SET Cantidad = ? WHERE ID = ?',
                [newQuantity, existing[0].ID]
            );
        } else {
            // 3. Insert new
            console.log(`Inserting new item. User: ${userId}, Product: ${productId}, Qty: ${quantity || 1}`);
            await query(
                'INSERT INTO Carrito (UsuarioID, ProductoID, Cantidad) VALUES (?, ?, ?)',
                [userId, productId, quantity || 1]
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error in POST /api/cart:', error);
        return NextResponse.json({ error: 'Error updating cart' }, { status: 500 });
    }
}

// PUT /api/cart - Update item quantity (absolute set)
export async function PUT(request) {
    try {
        const body = await request.json();
        const { userId, productId, quantity } = body;

        if (!userId || !productId || quantity === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await query(
            'UPDATE Carrito SET Cantidad = ? WHERE UsuarioID = ? AND ProductoID = ?',
            [quantity, userId, productId]
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating cart quantity:', error);
        return NextResponse.json({ error: 'Error updating cart quantity' }, { status: 500 });
    }
}

// DELETE /api/cart - Remove item from cart
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const productId = searchParams.get('productId');
        const clearAll = searchParams.get('clearAll');

        console.log('DELETE /api/cart params:', { userId, productId, clearAll });

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        if (clearAll === 'true') {
            await query('DELETE FROM Carrito WHERE UsuarioID = ?', [userId]);
        } else if (productId) {
            const result = await query('DELETE FROM Carrito WHERE UsuarioID = ? AND ProductoID = ?', [userId, productId]);
            console.log('Delete result:', result);
        } else {
            return NextResponse.json({ error: 'Product ID or clearAll required' }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error removing from cart:', error);
        console.error('Error stack:', error.stack);
        return NextResponse.json({ error: 'Error removing from cart', details: error.message }, { status: 500 });
    }
}
