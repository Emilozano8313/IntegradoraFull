# 🍽️ Sistema de Pedidos para Restaurante (POS & KDS)

Sistema integral para la administración de restaurantes que opera sobre una **red local (LAN)**. Coordina en tiempo real el flujo desde que el cliente hace su pedido en la mesa hasta que la cocina lo prepara y el mesero lo cobra.

---

## 🚀 Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 19 + Vite + Zustand |
| Estilos | Bootstrap 5 + CSS Custom |
| Backend | Java 17 + Spring Boot 3 + Spring Security |
| Base de Datos | MySQL (JPA/Hibernate) |

---

## ⚙️ Instalación

### Requisitos previos
Asegúrate de tener instalado:
- [Node.js](https://nodejs.org/) v18 o superior
- [Java JDK 17](https://adoptium.net/)
- [XAMPP](https://www.apachefriends.org/) (o cualquier servidor MySQL)

### Pasos

**1. Clona el repositorio**
```bash
git clone https://github.com/Emilozano8313/IntegradoraFull.git
cd IntegradoraFull
```

**2. Crea la base de datos**

Abre **phpMyAdmin** (o tu cliente MySQL) y crea un esquema vacío:
```sql
CREATE DATABASE restaurante_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**3. Configura las credenciales del backend**

Abre el archivo `backend/src/main/resources/application.properties` y ajusta tu usuario y contraseña de MySQL:
```properties
spring.datasource.username=root
spring.datasource.password=TU_PASSWORD
```

**4. Instala dependencias del frontend**
```bash
npm install
```

**5. Inicia el sistema**

> **Opción A (recomendada): scripts `.bat`**
> Simplemente haz doble clic en **`Iniciar Sistema.bat`** desde la raíz del proyecto. Este script arrancará automáticamente el backend (Spring Boot) y el frontend (Vite).

> **Opción B: manual**
> Abre dos terminales:
> ```bash
> # Terminal 1 — Backend
> cd backend
> ./mvnw spring-boot:run
>
> # Terminal 2 — Frontend
> npm run dev
> ```

**6. Accede a la aplicación**

| Rol | URL |
|---|---|
| 🧑‍🍽️ Mesero | `http://localhost:5173/?mesero=true` |
| 👨‍🍳 Cocina (KDS) | `http://localhost:5173/?cocina=true` |
| 🛠️ Admin | `http://localhost:5173/?admin=menu` |
| 📱 Cliente (mesa 1) | `http://localhost:5173/?mesa=1` |

> Para acceder desde otros dispositivos en la misma red WiFi, reemplaza `localhost` con la IP de tu computadora (ej. `192.168.1.50`).

---

## 🔐 Credenciales de Demo

| Rol | Correo | Contraseña |
|---|---|---|
| Mesero | `mesero@rest.com` | `123456` |
| Chef / Cocina | `chef1@rest.com` | `123456` |

---

## 📝 Notas

- Al **reiniciar el backend**, todos los usuarios de Staff deben volver a iniciar sesión (las sesiones se guardan en memoria).
- Para **cerrar el sistema**, usa el script **`Cerrar Sistema.bat`** o detén los procesos manualmente en los puertos `8080` y `5173`.
