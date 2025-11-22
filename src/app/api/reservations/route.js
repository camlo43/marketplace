// POST /api/reservations - Crear reserva de producto

import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { ProductoID, UsuarioID, Cantidad } = body;

        // Validaciones básicas
        if (!ProductoID || !UsuarioID || !Cantidad) {
            return NextResponse.json(
                { error: 'Campos requeridos: ProductoID, UsuarioID, Cantidad' },
                { status: 400 }
            );
        }

        // Usar el procedimiento almacenado ReservarProducto
        const sql = 'CALL ReservarProducto(?, ?, ?)';
        const result = await query(sql, [ProductoID, UsuarioID, Cantidad]);

        // El procedimiento devuelve el ID de la reserva
        const reservaId = result[0][0].ReservaID;

        return NextResponse.json(
            {
                success: true,
                reservationId: reservaId,
                message: 'Reserva creada exitosamente'
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating reservation:', error);

        // Manejar errores específicos del procedimiento almacenado
        if (error.sqlMessage) {
            return NextResponse.json(
                { error: error.sqlMessage },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Error al crear reserva' },
            { status: 500 }
        );
    }
}
