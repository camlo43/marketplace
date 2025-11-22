import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/messages - Get list of conversations for current user
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        // Get latest message for each conversation
        // This is a bit complex in SQL. We want distinct users interacted with.
        const sql = `
            SELECT 
                u.ID as otherUserId,
                u.Nombre as otherUserName,
                u.Apellidos as otherUserLastName,
                m.Mensaje as lastMessage,
                m.created_at as lastMessageTime,
                m.Leido as isRead,
                m.EmisorID
            FROM Mensajes m
            JOIN Usuarios u ON (m.EmisorID = u.ID OR m.ReceptorID = u.ID)
            WHERE (m.EmisorID = ? OR m.ReceptorID = ?) AND u.ID != ?
            AND m.ID IN (
                SELECT MAX(ID) 
                FROM Mensajes 
                WHERE EmisorID = ? OR ReceptorID = ? 
                GROUP BY CASE WHEN EmisorID = ? THEN ReceptorID ELSE EmisorID END
            )
            ORDER BY m.created_at DESC
        `;

        // Simplified approach: Get all distinct conversation partners first
        // Then get last message for each.
        // Actually, let's try a simpler query that works for now.

        const conversations = await query(`
            SELECT 
                CASE 
                    WHEN m.EmisorID = ? THEN m.ReceptorID 
                    ELSE m.EmisorID 
                END as otherUserId,
                MAX(m.created_at) as lastMessageTime
            FROM Mensajes m
            WHERE m.EmisorID = ? OR m.ReceptorID = ?
            GROUP BY otherUserId
            ORDER BY lastMessageTime DESC
        `, [userId, userId, userId]);

        const result = [];

        for (const conv of conversations) {
            // Get user details
            const users = await query('SELECT ID, Nombre, Apellidos FROM Usuarios WHERE ID = ?', [conv.otherUserId]);
            if (users.length === 0) continue;

            // Get last message details
            const msgs = await query(
                'SELECT Mensaje, Leido, EmisorID FROM Mensajes WHERE (EmisorID = ? AND ReceptorID = ?) OR (EmisorID = ? AND ReceptorID = ?) ORDER BY created_at DESC LIMIT 1',
                [userId, conv.otherUserId, conv.otherUserId, userId]
            );

            result.push({
                id: users[0].ID,
                name: `${users[0].Nombre} ${users[0].Apellidos}`,
                lastMessage: msgs[0].Mensaje,
                time: conv.lastMessageTime,
                unread: msgs[0].EmisorID !== parseInt(userId) && !msgs[0].Leido
            });
        }

        return NextResponse.json(result);

    } catch (error) {
        console.error('Error fetching conversations:', error);
        return NextResponse.json({ error: 'Error fetching messages' }, { status: 500 });
    }
}

// POST /api/messages - Send a new message
export async function POST(request) {
    try {
        const body = await request.json();
        const { senderId, receiverId, productId, message } = body;

        if (!senderId || !receiverId || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const result = await query(
            'INSERT INTO Mensajes (EmisorID, ReceptorID, ProductoID, Mensaje) VALUES (?, ?, ?, ?)',
            [senderId, receiverId, productId || null, message]
        );

        return NextResponse.json({ success: true, messageId: result.insertId });

    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json({ error: 'Error sending message' }, { status: 500 });
    }
}
