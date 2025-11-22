// GET /api/products - Obtener todos los productos activos
// POST /api/products - Crear nuevo producto

import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const search = searchParams.get('q');
        const sellerId = searchParams.get('seller_id');

        let sql = `
            SELECT p.*, 
                   u.Nombre as VendedorNombre, 
                   u.Apellidos as VendedorApellido,
                   GROUP_CONCAT(f.Ruta ORDER BY f.Orden ASC SEPARATOR ',') as Imagenes
            FROM Productos p
            LEFT JOIN FotosProducto f ON p.ID = f.ProductoID
            LEFT JOIN Usuarios u ON p.Vendedor = u.ID
            WHERE p.activo = 1
        `;
        const params = [];

        if (category && category !== 'ofertas') {
            sql += ' AND p.Categoria = ?';
            params.push(category);
        }

        if (sellerId) {
            sql += ' AND p.Vendedor = ?';
            params.push(sellerId);
        }

        if (search) {
            sql += ' AND (p.Nombre LIKE ? OR p.Marca LIKE ? OR p.Descripcion LIKE ?)';
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        sql += ' GROUP BY p.ID ORDER BY p.ID DESC';

        const products = await query(sql, params);

        return NextResponse.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { error: 'Error al obtener productos', details: error.message },
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
            Cantidad,
            images // Array of image paths
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

        const productId = result.insertId;

        // Insert images if provided
        if (images && Array.isArray(images) && images.length > 0) {
            for (let i = 0; i < images.length; i++) {
                await query(
                    'INSERT INTO FotosProducto (ProductoID, Ruta, Orden) VALUES (?, ?, ?)',
                    [productId, images[i], i]
                );
            }
        }

        return NextResponse.json(
            {
                success: true,
                productId: productId,
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
