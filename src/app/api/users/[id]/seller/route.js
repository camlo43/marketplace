// PUT /api/users/[id]/seller - Convertir usuario en vendedor

import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
    try {
        const { id } = params;

        // Usar el procedimiento almacenado SerVendedor
        const sql = 'CALL SerVendedor(?)';
        await query(sql, [id]);

        // Obtener el usuario actualizado
        const users = await query(
            'SELECT ID, Nombre, Apellidos, correo, vendedor FROM Usuarios WHERE ID = ?',
            [id]
        );

        if (users.length === 0) {
            return NextResponse.json(
                { error: 'Usuario no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            user: users[0],
            message: 'Usuario convertido en vendedor exitosamente'
        });
    } catch (error) {
        console.error('Error converting user to seller:', error);
        return NextResponse.json(
            { error: 'Error al convertir usuario en vendedor' },
            { status: 500 }
        );
    }
}
