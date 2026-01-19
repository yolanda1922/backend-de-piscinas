const express = require("express");
const router = express.Router();
const auth = require("../middellware/autorizathion");
const {
  registrarUsuario,
  loginUsuario,
  verificarUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario,
  crearCarrito,
  obtenerCarrito,
  agregarProductoCarrito,
  actualizarProductoCarrito,
  eliminarProductoCarrito,
  vaciarCarrito
} = require("../controllers/usuarioController");

// Rutas públicas (sin autenticación)
router.post("/register", registrarUsuario);
router.post("/login", loginUsuario);

// Rutas protegidas (con autenticación)
router.get("/verificar", auth, verificarUsuario);
router.get("/", obtenerUsuarios);
router.get("/:id", obtenerUsuarioPorId);
router.put("/:id", auth, actualizarUsuario);
router.delete("/:id", auth, eliminarUsuario);

// ===== RUTAS DEL CARRITO =====
// Crear carrito
router.post("/carrito", crearCarrito);
// Obtener carrito de un usuario
router.get("/:usuarioId/carrito", obtenerCarrito);
// Agregar producto al carrito
router.post("/:usuarioId/carrito/productos", agregarProductoCarrito);
// Actualizar cantidad de producto en carrito
router.put("/:usuarioId/carrito/productos/:productoId", actualizarProductoCarrito);
// Eliminar producto del carrito
router.delete("/:usuarioId/carrito/productos/:productoId", eliminarProductoCarrito);
// Vaciar carrito
router.delete("/:usuarioId/carrito", vaciarCarrito);

module.exports = router;