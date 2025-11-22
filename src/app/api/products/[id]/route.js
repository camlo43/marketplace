// GET /api/products/[id] - Obtener producto por ID
// PUT /api/products/[id] - Actualizar producto
// DELETE /api/products/[id] - Eliminar producto (soft delete)

import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    try {
        const { id } = params;

        const sql = 'SELECT * FROM Productos WHERE ID = ? AND activo = 1';
        const products = await query(sql, [id]);

        if (products.length === 0) {
            return NextResponse.json(
                { error: 'Producto no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json(products[0]);
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json(
            { error: 'Error al obtener producto' },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const body = await request.json();

        const {
            Nombre,
            Descripcion,
            Estado,
            Categoria,
            Especificacion,
            Marca,
            Uso,
            Precio,
            Cantidad
        } = body;

        const sql = `
      UPDATE Productos 
      SET Nombre = ?, Descripcion = ?, Estado = ?, Categoria = ?, 
          Especificacion = ?, Marca = ?, Uso = ?, Precio = ?, Cantidad = ?
      WHERE ID = ? AND activo = 1
    `;

        const result = await query(sql, [
            Nombre,
            Descripcion,
            Estado,
            Categoria,
            Especificacion,
            Marca,
            Uso,
            Precio,
            Cantidad,
            id
        ]);

        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: 'Producto no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Producto actualizado exitosamente'
        });
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json(
            { error: 'Error al actualizar producto' },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = params;

        // Soft delete: marcar como inactivo
        const sql = 'UPDATE Productos SET activo = 0, Cantidad = 0 WHERE ID = ?';
        const result = await query(sql, [id]);

        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: 'Producto no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Producto eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json(
            { error: 'Error al eliminar producto' },
            { status: 500 }
        );
    }
}
