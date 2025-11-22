import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    try {
        const { id } = await params;

        // Validar ID
        if (!id) {
            return NextResponse.json(
                { error: 'ID de usuario requerido' },
                { status: 400 }
            );
        }

        // Consultar datos públicos del usuario
        // Solo retornamos Nombre, Apellidos, Fecha de registro y si es vendedor
        const users = await query(
            'SELECT ID, Nombre, Apellidos, created_at, vendedor FROM Usuarios WHERE ID = ?',
            [id]
        );

        if (users.length === 0) {
            return NextResponse.json(
                { error: 'Usuario no encontrado' },
                { status: 404 }
            );
        }

        const user = users[0];

        return NextResponse.json({
            success: true,
            user: {
                id: user.ID,
                name: user.Nombre,
                lastName: user.Apellidos,
                joinedAt: user.created_at,
                isSeller: user.vendedor === 1
            }
        });

    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json(
            { error: 'Error al obtener datos del usuario' },
            { status: 500 }
        );
    }
}
