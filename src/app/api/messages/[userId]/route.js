import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    try {
        const { searchParams } = new URL(request.url);
        const currentUserId = searchParams.get('currentUserId');
        const { userId: otherUserId } = await params; // Next.js 15 params are async

        if (!currentUserId || !otherUserId) {
            return NextResponse.json({ error: 'Missing user IDs' }, { status: 400 });
        }

        // Fetch chat history between current user and other user
        const messages = await query(
            `SELECT 
                m.ID, 
                m.EmisorID as senderId, 
                m.ReceptorID as receiverId, 
                m.Mensaje as text, 
                m.created_at as timestamp,
                m.ProductoID
             FROM Mensajes m
             WHERE (m.EmisorID = ? AND m.ReceptorID = ?) 
                OR (m.EmisorID = ? AND m.ReceptorID = ?)
             ORDER BY m.created_at ASC`,
            [currentUserId, otherUserId, otherUserId, currentUserId]
        );

        // Mark messages as read
        await query(
            'UPDATE Mensajes SET Leido = 1 WHERE EmisorID = ? AND ReceptorID = ? AND Leido = 0',
            [otherUserId, currentUserId]
        );

        return NextResponse.json(messages);

    } catch (error) {
        console.error('Error fetching chat history:', error);
        return NextResponse.json({ error: 'Error fetching chat history' }, { status: 500 });
    }
}
