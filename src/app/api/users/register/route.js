// POST /api/users/register - Crear nuevo usuario

import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const {
            Nombre,
            Apellidos,
            Pais,
            Ciudad,
            Celular,
            correo,
            password
        } = body;

        // Validaciones básicas
        if (!Nombre || !Apellidos || !correo || !password) {
            return NextResponse.json(
                { error: 'Campos requeridos: Nombre, Apellidos, correo, password' },
                { status: 400 }
            );
        }

        // Verificar si el correo ya existe
        const existingUser = await query(
            'SELECT ID FROM Usuarios WHERE correo = ?',
            [correo]
        );

        if (existingUser.length > 0) {
            return NextResponse.json(
                { error: 'El correo ya está registrado' },
                { status: 409 }
            );
        }

        // Usar el procedimiento almacenado CrearUsuario
        const sql = 'CALL CrearUsuario(?, ?, ?, ?, ?, ?)';
        const result = await query(sql, [
            Nombre,
            Apellidos,
            Pais || null,
            Ciudad || null,
            Celular || null,
            correo
        ]);

        // El procedimiento devuelve el ID del nuevo usuario
        const newUserId = result[0][0].NuevoUsuarioID;

        // Convertir automáticamente al usuario en vendedor
        await query('CALL SerVendedor(?)', [newUserId]);

        // Obtener el usuario creado (ahora con vendedor = 1)
        const newUser = await query(
            'SELECT ID, Nombre, Apellidos, correo, vendedor FROM Usuarios WHERE ID = ?',
            [newUserId]
        );

        return NextResponse.json(
            {
                success: true,
                user: newUser[0],
                message: 'Usuario registrado exitosamente como vendedor'
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error registering user:', error);
        return NextResponse.json(
            { error: 'Error al registrar usuario' },
            { status: 500 }
        );
    }
}
