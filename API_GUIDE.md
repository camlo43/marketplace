# Guía de Uso de API Routes - Marketplace

## 🚀 Configuración Inicial

### 1. Crear archivo `.env.local` en la raíz del proyecto:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=1042849815
DB_NAME=marketplace_db
```

### 2. Ejecutar el script SQL para crear la base de datos:

```bash
mysql -u root -p < DB/create_database_and_tables.sql
```

### 3. Reiniciar el servidor de desarrollo:

```bash
npm run dev
```

---

## 📡 Endpoints Disponibles

### **Productos**

#### Listar todos los productos
```bash
GET http://localhost:3000/api/products
```

#### Filtrar por categoría
```bash
GET http://localhost:3000/api/products?category=Motor
```

#### Buscar productos
```bash
GET http://localhost:3000/api/products?q=frenos
```

#### Obtener producto por ID
```bash
GET http://localhost:3000/api/products/1
```

#### Crear producto
```bash
POST http://localhost:3000/api/products
Content-Type: application/json

{
  "Vendedor": 1,
  "Nombre": "Pastillas de Freno Brembo",
  "Descripcion": "Pastillas de freno de alto rendimiento",
  "Estado": "Nuevo",
  "Categoria": "Frenos",
  "Marca": "Brembo",
  "Divisa": "COP",
  "Precio": 250000,
  "Cantidad": 10
}
```

#### Actualizar producto
```bash
PUT http://localhost:3000/api/products/1
Content-Type: application/json

{
  "Nombre": "Pastillas de Freno Brembo Premium",
  "Precio": 280000,
  "Cantidad": 8
}
```

#### Eliminar producto (soft delete)
```bash
DELETE http://localhost:3000/api/products/1
```

---

### **Usuarios**

#### Registrar usuario
```bash
POST http://localhost:3000/api/users/register
Content-Type: application/json

{
  "Nombre": "Juan",
  "Apellidos": "Pérez García",
  "Pais": "Colombia",
  "Ciudad": "Bogotá",
  "Celular": "+57 300 123 4567",
  "correo": "juan@example.com",
  "password": "miPassword123"
}
```

#### Login
```bash
POST http://localhost:3000/api/users/login
Content-Type: application/json

{
  "correo": "juan@example.com",
  "password": "miPassword123"
}
```

#### Convertir usuario en vendedor
```bash
PUT http://localhost:3000/api/users/1/seller
```

---

### **Reservas**

#### Crear reserva
```bash
POST http://localhost:3000/api/reservations
Content-Type: application/json

{
  "ProductoID": 1,
  "UsuarioID": 1,
  "Cantidad": 2
}
```

---

## 🧪 Probar con cURL

### Listar productos
```bash
curl http://localhost:3000/api/products
```

### Crear usuario
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "Nombre": "María",
    "Apellidos": "González",
    "correo": "maria@example.com",
    "password": "pass123"
  }'
```

### Crear producto
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "Vendedor": 1,
    "Nombre": "Filtro de Aceite",
    "Precio": 35000,
    "Cantidad": 20,
    "Categoria": "Motor"
  }'
```

---

## 🔧 Próximos Pasos

1. **Integrar con ProductContext**: Modificar `src/context/ProductContext.js` para usar las APIs
2. **Integrar con AuthContext**: Modificar `src/context/AuthContext.js` para usar las APIs
3. **Agregar autenticación JWT**: Implementar tokens para sesiones seguras
4. **Hash de contraseñas**: Usar bcrypt para seguridad
5. **Subir imágenes**: Implementar endpoint para `FotosProducto`

---

## ⚠️ Notas Importantes

- Las contraseñas NO están hasheadas (solo para desarrollo)
- No hay autenticación JWT implementada aún
- Los endpoints están sin protección (cualquiera puede acceder)
- Falta implementar rate limiting
- Falta validación exhaustiva de datos
