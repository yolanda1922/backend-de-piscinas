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
  eliminarUsuario
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

module.exports = router;