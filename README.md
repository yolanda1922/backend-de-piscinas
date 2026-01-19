# 🏊‍♂️ API de Piscinas

Una aplicación backend completa para la gestión de piscinas y usuarios con funcionalidad de carrito de compras, desarrollada con Node.js, Express y MongoDB.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [API Endpoints](#-api-endpoints)
- [Modelos de Datos](#-modelos-de-datos)
- [Autenticación](#-autenticación)
- [Scripts Disponibles](#-scripts-disponibles)

## ✨ Características

- 🔐 **Autenticación JWT**: Login y registro de usuarios con tokens seguros
- 👥 **Gestión de Usuarios**: CRUD completo de usuarios con encriptación de contraseñas
- 🏊‍♂️ **Gestión de Piscinas**: Manejo completo de información de piscinas
- 🛒 **Carrito de Compras**: Sistema completo de carrito de compras para usuarios
- 🔒 **Middleware de Autorización**: Rutas protegidas con verificación de tokens
- 📁 **Arquitectura MVC**: Código bien organizado y mantenible
- 🗄️ **Base de Datos MongoDB**: Almacenamiento en la nube con Mongoose ODM

## 🛠️ Tecnologías Utilizadas

- **Backend**: Node.js, Express.js
- **Base de Datos**: MongoDB con Mongoose
- **Autenticación**: JSON Web Tokens (JWT), bcryptjs
- **Middleware**: CORS, dotenv
- **Herramientas de Desarrollo**: Nodemon

## 📁 Estructura del Proyecto

```
piscinas/
├── src/
│   ├── config/
│   │   └── db.js                    # Configuración de base de datos
│   ├── controllers/
│   │   ├── usuarioController.js     # Controlador de usuarios y carrito
│   │   └── piscinas.controllers.js  # Controlador de piscinas
│   ├── middleware/
│   │   └── autorizathion.js         # Middleware de autenticación JWT
│   ├── models/
│   │   ├── Usuario.js               # Modelo de usuario
│   │   ├── Piscina.js               # Modelo de piscina
│   │   └── carrito.js               # Modelo de carrito
│   ├── routes/
│   │   ├── usuarios.routes.js       # Rutas de usuarios y carrito
│   │   └── piscinas.routes.js       # Rutas de piscinas
│   └── index.js                     # Archivo principal del servidor
├── .env                             # Variables de entorno
├── .gitignore                       # Archivos ignorados por Git
├── package.json                     # Dependencias y scripts
└── README.md                        # Documentación del proyecto
```

## 🚀 Instalación

1. **Clona el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd piscinas
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   Crea un archivo `.env` en la raíz del proyecto:
   ```env
   MONGODB_URI=tu_uri_de_mongodb
   PORT=3002
   SECRET=tu_clave_secreta_jwt
   ```

## ⚙️ Configuración

### Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `MONGODB_URI` | URI de conexión a MongoDB | `mongodb+srv://usuario:contraseña@cluster.mongodb.net/` |
| `PORT` | Puerto del servidor | `3002` |
| `SECRET` | Clave secreta para JWT | `mi_clave_super_secreta` |

## 💻 Uso

### Desarrollo
```bash
npm run dev
```

El servidor se ejecutará en `http://localhost:3002`

### Producción
```bash
npm start
```

## 📡 API Endpoints

### 👥 Usuarios

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `POST` | `/usuarios/register` | Registrar nuevo usuario | No |
| `POST` | `/usuarios/login` | Iniciar sesión | No |
| `GET` | `/usuarios/verificar` | Verificar token de usuario | Sí |
| `GET` | `/usuarios/` | Obtener todos los usuarios | No |
| `GET` | `/usuarios/:id` | Obtener usuario por ID | No |
| `PUT` | `/usuarios/:id` | Actualizar usuario | Sí |
| `DELETE` | `/usuarios/:id` | Eliminar usuario | Sí |

### 🛒 Carrito de Compras

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `POST` | `/usuarios/carrito` | Crear carrito | No |
| `GET` | `/usuarios/:usuarioId/carrito` | Obtener carrito del usuario | No |
| `POST` | `/usuarios/:usuarioId/carrito/productos` | Agregar producto al carrito | No |
| `PUT` | `/usuarios/:usuarioId/carrito/productos/:productoId` | Actualizar cantidad de producto | No |
| `DELETE` | `/usuarios/:usuarioId/carrito/productos/:productoId` | Eliminar producto del carrito | No |
| `DELETE` | `/usuarios/:usuarioId/carrito` | Vaciar carrito | No |

### 🏊‍♂️ Piscinas

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/piscinas/` | Obtener todas las piscinas | No |
| `POST` | `/piscinas/` | Crear nueva piscina | No |
| `GET` | `/piscinas/:id` | Obtener piscina por ID | No |
| `PUT` | `/piscinas/:id` | Actualizar piscina | No |
| `DELETE` | `/piscinas/:id` | Eliminar piscina | No |

## 📊 Modelos de Datos

### Usuario
```javascript
{
  nombre: String (requerido),
  email: String (requerido, único),
  password: String (requerido, encriptado),
  createdAt: Date,
  updatedAt: Date
}
```

### Piscina
```javascript
{
  nombre: String (requerido),
  descripcion: String (requerido),
  ubicacion: String (requerido),
  precio: Number (requerido)
}
```

### Carrito
```javascript
{
  usuarioId: ObjectId (referencia a Usuario),
  productos: [{
    nombreProducto: String,
    precioProducto: Number,
    cantidad: Number,
    Imagen: String,
    slug: String
  }]
}
```

## 🔐 Autenticación

La API utiliza JSON Web Tokens (JWT) para la autenticación. Para acceder a rutas protegidas:

1. **Registra o inicia sesión** para obtener un token
2. **Incluye el token** en el header `Authorization`:
   ```
   Authorization: Bearer tu_token_jwt_aquí
   ```

### Ejemplo de Registro
```bash
POST /usuarios/register
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "password": "miContraseñaSegura"
}
```

### Ejemplo de Login
```bash
POST /usuarios/login
Content-Type: application/json

{
  "email": "juan@ejemplo.com",
  "password": "miContraseñaSegura"
}
```

## 📜 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor en modo desarrollo con nodemon |
| `npm test` | Ejecuta las pruebas (no configurado) |

## 🛡️ Seguridad

- ✅ Contraseñas encriptadas con bcryptjs
- ✅ Autenticación JWT con expiración
- ✅ Validación de datos de entrada
- ✅ Variables de entorno para datos sensibles
- ✅ CORS configurado para solicitudes cross-origin

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia ISC.

## 📞 Contacto

Para preguntas o soporte, puedes contactar al equipo de desarrollo.

---

⭐ **¡No olvides dar una estrella al proyecto si te resulta útil!**