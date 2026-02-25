# 🔗 Accesos Rápidos del Sistema

Aquí tienes los enlaces directos para acceder a los diferentes roles y vistas de la aplicación.

> **Nota:** Reemplaza `localhost` por la IP de tu red (ej. `192.168.1.50`) si deseas acceder desde otros dispositivos (celulares, tablets).

## 👨‍🍳 Áreas de Staff

### 🍳 Cocina (Dashboard en Vivo)
Vista para el personal de cocina. Muestra pedidos pendientes, en preparación y terminados.
- **Link:** `http://localhost:5173/?cocina=true`

### 🛠️ Administración del Menú
Vista para gestionar platillos. Permite editar precios, agregar nuevos productos y modificar descripciones.
- **Link:** `http://localhost:5173/?admin=menu`

### 🖨️ Generador de QRs
Herramienta para configurar la URL base e imprimir los códigos QR de las mesas.
- **Link:** `http://localhost:5173/?admin=qr`

---

## 📱 Vista de Clientes

### 🍽️ Simulación de Mesa (Cliente)
Para probar cómo ve el menú un cliente en una mesa específica. Cambia el número al final para probar otras mesas.
- **Mesa 1:** `http://localhost:5173/?mesa=1`
- **Mesa 5:** `http://localhost:5173/?mesa=5`

### 👋 Pantalla de Bienvenida
Lo que ve un usuario si entra sin escanear un QR (sin número de mesa).
- **Link:** `http://localhost:5173/`
