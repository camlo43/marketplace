#!/bin/bash

# Script de prueba para las APIs del Marketplace
# Asegúrate de que el servidor esté corriendo: npm run dev

echo "🧪 Probando APIs del Marketplace..."
echo ""

BASE_URL="http://localhost:3000/api"

# Test 1: Crear usuario
echo "1️⃣  Creando usuario de prueba..."
USER_RESPONSE=$(curl -s -X POST "$BASE_URL/users/register" \
  -H "Content-Type: application/json" \
  -d '{
    "Nombre": "Test",
    "Apellidos": "Usuario",
    "Pais": "Colombia",
    "Ciudad": "Bogotá",
    "correo": "test@marketplace.com",
    "password": "test123"
  }')
echo "$USER_RESPONSE" | jq '.'
USER_ID=$(echo "$USER_RESPONSE" | jq -r '.user.ID')
echo ""

# Test 2: Login
echo "2️⃣  Probando login..."
curl -s -X POST "$BASE_URL/users/login" \
  -H "Content-Type: application/json" \
  -d '{
    "correo": "test@marketplace.com",
    "password": "test123"
  }' | jq '.'
echo ""

# Test 3: Convertir en vendedor
echo "3️⃣  Convirtiendo usuario en vendedor..."
curl -s -X PUT "$BASE_URL/users/$USER_ID/seller" | jq '.'
echo ""

# Test 4: Crear producto
echo "4️⃣  Creando producto..."
PRODUCT_RESPONSE=$(curl -s -X POST "$BASE_URL/products" \
  -H "Content-Type: application/json" \
  -d "{
    \"Vendedor\": $USER_ID,
    \"Nombre\": \"Pastillas de Freno Brembo\",
    \"Descripcion\": \"Pastillas de alto rendimiento\",
    \"Estado\": \"Nuevo\",
    \"Categoria\": \"Frenos\",
    \"Marca\": \"Brembo\",
    \"Divisa\": \"COP\",
    \"Precio\": 250000,
    \"Cantidad\": 10
  }")
echo "$PRODUCT_RESPONSE" | jq '.'
PRODUCT_ID=$(echo "$PRODUCT_RESPONSE" | jq -r '.productId')
echo ""

# Test 5: Listar productos
echo "5️⃣  Listando productos..."
curl -s "$BASE_URL/products" | jq '.'
echo ""

# Test 6: Obtener producto por ID
echo "6️⃣  Obteniendo producto por ID..."
curl -s "$BASE_URL/products/$PRODUCT_ID" | jq '.'
echo ""

# Test 7: Crear reserva
echo "7️⃣  Creando reserva..."
curl -s -X POST "$BASE_URL/reservations" \
  -H "Content-Type: application/json" \
  -d "{
    \"ProductoID\": $PRODUCT_ID,
    \"UsuarioID\": $USER_ID,
    \"Cantidad\": 2
  }" | jq '.'
echo ""

echo "✅ Pruebas completadas!"
