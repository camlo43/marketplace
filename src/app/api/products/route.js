// GET /api/products - Obtener todos los productos activos
// POST /api/products - Crear nuevo producto

import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const search = searchParams.get('q');

        let sql = 'SELECT * FROM Productos WHERE activo = 1';
        const params = [];

        if (category && category !== 'ofertas') {
            sql += ' AND Categoria = ?';
            params.push(category);
        }

        if (search) {
            sql += ' AND (Nombre LIKE ? OR Marca LIKE ? OR Descripcion LIKE ?)';
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        sql += ' ORDER BY ID DESC';

        const products = await query(sql, params);

        return NextResponse.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { error: 'Error al obtener productos' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const {
            Vendedor,
            Nombre,
            Descripcion,
            Estado,
            Categoria,
            Especificacion,
            Marca,
            Uso,
            Divisa = 'COP',
            Precio,
            Cantidad
        } = body;

        // Validaciones básicas
        if (!Vendedor || !Nombre || !Precio || !Cantidad) {
            return NextResponse.json(
                { error: 'Campos requeridos: Vendedor, Nombre, Precio, Cantidad' },
                { status: 400 }
            );
        }

        const sql = `
      INSERT INTO Productos 
      (Vendedor, Nombre, Descripcion, Estado, Categoria, Especificacion, Marca, Uso, Divisa, Precio, Cantidad)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        const result = await query(sql, [
            Vendedor,
            Nombre,
            Descripcion,
            Estado,
            Categoria,
            Especificacion,
            Marca,
            Uso,
            Divisa,
            Precio,
            Cantidad
        ]);

        return NextResponse.json(
            {
                success: true,
                productId: result.insertId,
                message: 'Producto creado exitosamente'
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json(
            { error: 'Error al crear producto' },
            { status: 500 }
        );
    }
}
