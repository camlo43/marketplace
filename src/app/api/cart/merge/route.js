import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

// POST /api/cart/merge - Merge guest cart items into user cart
export async function POST(request) {
    try {
        const body = await request.json();
        const { userId, items } = body;

        if (!userId || !Array.isArray(items)) {
            return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
        }

        console.log('POST /api/cart/merge:', { userId, itemsCount: items.length, items });

        for (const item of items) {
            // Check if item exists
            const existing = await query(
                'SELECT ID, Cantidad FROM Carrito WHERE UsuarioID = ? AND ProductoID = ?',
                [userId, item.id] // Assuming item.id is productId
            );

            if (existing.length > 0) {
                // Update quantity (add guest quantity to existing)
                // Or keep max? Usually add.
                // Let's just ensure it's at least 1.
                // If we want to be smart, we could add them, but let's just ignore duplicates for now to be safe, 
                // or update if we want to merge quantities.
                // Let's update quantity.
                await query(
                    'UPDATE Carrito SET Cantidad = Cantidad + ? WHERE ID = ?',
                    [item.quantity || 1, existing[0].ID]
                );
            } else {
                // Insert new item
                await query(
                    'INSERT INTO Carrito (UsuarioID, ProductoID, Cantidad) VALUES (?, ?, ?)',
                    [userId, item.id, item.quantity || 1]
                );
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error merging cart:', error);
        return NextResponse.json({ error: 'Error merging cart' }, { status: 500 });
    }
}
