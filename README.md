# 🍽️ POS & KDS Restaurante

Sistema integral para la administración de restaurantes, operando sobre una red local (LAN) para coordinar Meseros y Cocina en tiempo real.

## 🚀 Stack Tecnológico

*   **Frontend**: React 19 + Vite + Zustand (Gestión rápida de estado global)
*   **Diseño**: CSS Custom + Bootstrap 5 + Iconos Lucide
*   **Backend**: Java 17 + Spring Boot 3 + Spring Security
*   **Base de Datos**: MySQL (JPA/Hibernate)

## 📌 Funcionalidades Principales

1.  **📍 Punto de Venta Dinámico**: Los meseros acceden desde tablets web para asignar mesas, tomar comandos y cobrar (cerrar facturas).
2.  **🧑‍🍳 Kitchen Display System (KDS)**: Vistas de cocina para roles de Chef, Barista o Parrillero. Actualización instantánea (Polling) para marcar comandas en preparación y listas.
3.  **📦 Administración y Menú**: Panel protegido para registrar productos, imágenes, precios en tiempo real y emitir códigos QR de acceso automático.

## 🏗️ Puesta en Marcha (Entorno Local)

### Requisitos

*   Node.js (18+)
*   Java JDK 17
*   MySQL Server (Puerto 3306)

### Pasos

1.  **Base de Datos**: Crea un esquema vacío llamado `restaurante_db`.
2.  **Credenciales**: Configura el archivo `application.properties` de tu backend con tu usuario/password de MySQL. (Omitido del repositorio).
3.  **Instalar Frontend**: Ubicado en la raíz, ejecuta `npm install`.
4.  **Lanzar**. Usa los scripts `.bat` que vienen en el repositorio:
    *   `Iniciar Sistema.bat`: Ejecutará tu API en Spring Boot por ti y abrirá Vite.
    *   `Cerrar Sistema.bat`: Cerrará puertos.

## 🔐 Logins y Demo

Consulta el archivo [ACCESOS.md](./ACCESOS.md) para explorar las URL públicas (mesas de clientes) y los credenciales del staff temporal de muestra.
