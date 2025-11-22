// POST /api/users/login - Autenticar usuario

import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { correo, password } = body;

        // Validaciones básicas
        if (!correo || !password) {
            return NextResponse.json(
                { error: 'Correo y contraseña son requeridos' },
                { status: 400 }
            );
        }

        // Buscar usuario por correo
        const users = await query(
            'SELECT ID, Nombre, Apellidos, correo, vendedor, activo FROM Usuarios WHERE correo = ? AND activo = 1',
            [correo]
        );

        if (users.length === 0) {
            return NextResponse.json(
                { error: 'Credenciales inválidas' },
                { status: 401 }
            );
        }

        const user = users[0];

        // NOTA: En producción, deberías usar bcrypt para hashear contraseñas
        // Por ahora, esto es solo para desarrollo/demo
        // TODO: Implementar hash de contraseñas con bcrypt

        return NextResponse.json({
            success: true,
            user: {
                id: user.ID,
                name: user.Nombre,
                lastName: user.Apellidos,
                email: user.correo,
                isVendedor: user.vendedor === 1
            },
            message: 'Login exitoso'
        });
    } catch (error) {
        console.error('Error logging in:', error);
        return NextResponse.json(
            { error: 'Error al iniciar sesión' },
            { status: 500 }
        );
    }
}
