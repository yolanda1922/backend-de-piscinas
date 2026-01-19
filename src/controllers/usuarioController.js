const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");
const Carrito = require("../models/carrito");

// Registrar usuario
const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    
    // Validar que todos los campos requeridos estén presentes
    if (!nombre || !email || !password) {
      return res
        .status(400)
        .json({ message: "Nombre, email y password son obligatorios" });
    }
    
    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res
        .status(400)
        .json({ message: "El usuario ya existe con ese email" });
    }
    
    // Encriptar la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: hashedPassword
    });
    
    await nuevoUsuario.save();
    
    // Devolver la información del usuario incluyendo la password encriptada
    const usuarioRespuesta = {
      _id: nuevoUsuario._id,
      nombre: nuevoUsuario.nombre,
      email: nuevoUsuario.email,
      password: nuevoUsuario.password,
      createdAt: nuevoUsuario.createdAt,
      updatedAt: nuevoUsuario.updatedAt
    };
    
    return res.status(201).json({
      message: "Usuario creado exitosamente",
      usuario: usuarioRespuesta
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al crear el usuario", error: error.message });
  }
};

// Login de usuario
const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validar campos requeridos
    if (!email || !password) {
      return res.status(400).json({ message: "Email y password son obligatorios" });
    }
    
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ message: "El usuario no existe" });
    }
    
    // Verificar contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ message: "El email o la password son inválidos" });
    }
    
    // Crear payload para JWT
    const payload = {
      usuario: {
        id: usuario._id,
        email: usuario.email,
        nombre: usuario.nombre
      }
    };
    
    // Generar token JWT
    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "1h" });
    
    // Respuesta con token
    const usuarioRespuesta = {
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email
    };
    
    return res.status(200).json({
      message: "Login exitoso",
      usuario: usuarioRespuesta,
      token: token
    });
    
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al iniciar sesión", error: error.message });
  }
};

// Verificar usuario autenticado
const verificarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select('-password');
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({
      message: "Usuario verificado exitosamente",
      usuario: usuario
    });
  } catch (error) {
    res.status(500).json({
      message: "Hubo un error al validar el usuario",
      error: error.message
    });
  }
};

// Obtener todos los usuarios
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-password');
    return res.status(200).json({
      message: "Usuarios obtenidos exitosamente",
      usuarios: usuarios
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener los usuarios", error: error.message });
  }
};

// Obtener usuario por ID
const obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findById(id).select('-password');
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    return res.status(200).json({
      message: "Usuario obtenido exitosamente",
      usuario: usuario
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener el usuario", error: error.message });
  }
};

// Actualizar usuario
const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, password } = req.body;
    
    const updateData = { nombre, email };
    
    // Si se proporciona una nueva contraseña, encriptarla
    if (password) {
      const saltRounds = 10;
      const hashedPasswordUpdate = await bcrypt.hash(password, saltRounds);
      updateData.password = hashedPasswordUpdate;
    }
    
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).select('-password');
    
    if (!usuarioActualizado) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    
    return res.status(200).json({
      message: "Usuario actualizado exitosamente",
      usuario: usuarioActualizado
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar el usuario",
      error: error.message
    });
  }
};

// Eliminar usuario
const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioEliminado = await Usuario.findByIdAndDelete(id);
    
    if (!usuarioEliminado) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    
    return res.status(200).json({ 
      message: "Usuario eliminado correctamente"
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al eliminar el usuario", error: error.message });
  }
};

// ===== FUNCIONES DEL CARRITO =====

// Crear carrito para un usuario
const crearCarrito = async (req, res) => {
  try {
    const { usuarioId } = req.body;
    
    // Verificar si el usuario existe
    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    
    // Verificar si el usuario ya tiene un carrito
    const carritoExistente = await Carrito.findOne({ usuarioId });
    if (carritoExistente) {
      return res.status(400).json({ message: "El usuario ya tiene un carrito" });
    }
    
    const nuevoCarrito = new Carrito({
      usuarioId,
      productos: []
    });
    
    await nuevoCarrito.save();
    
    return res.status(201).json({
      message: "Carrito creado exitosamente",
      carrito: nuevoCarrito
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al crear el carrito",
      error: error.message
    });
  }
};

// Obtener carrito de un usuario
const obtenerCarrito = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    
    const carrito = await Carrito.findOne({ usuarioId }).populate('usuarioId', 'nombre email');
    if (!carrito) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }
    
    return res.status(200).json({
      message: "Carrito obtenido exitosamente",
      carrito: carrito
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener el carrito",
      error: error.message
    });
  }
};

// Agregar producto al carrito
const agregarProductoCarrito = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const { nombreProducto, precioProducto, cantidad, Imagen, slug } = req.body;
    
    // Validar campos requeridos
    if (!nombreProducto || !precioProducto || !cantidad) {
      return res.status(400).json({
        message: "Nombre del producto, precio y cantidad son obligatorios"
      });
    }
    
    let carrito = await Carrito.findOne({ usuarioId });
    
    // Si no existe carrito, crearlo
    if (!carrito) {
      carrito = new Carrito({
        usuarioId,
        productos: []
      });
    }
    
    // Verificar si el producto ya existe en el carrito
    const productoExistente = carrito.productos.find(p => p.slug === slug);
    
    if (productoExistente) {
      // Si existe, aumentar la cantidad
      productoExistente.cantidad += parseInt(cantidad);
    } else {
      // Si no existe, agregar nuevo producto
      carrito.productos.push({
        nombreProducto,
        precioProducto: parseFloat(precioProducto),
        cantidad: parseInt(cantidad),
        Imagen,
        slug
      });
    }
    
    await carrito.save();
    
    return res.status(200).json({
      message: "Producto agregado al carrito exitosamente",
      carrito: carrito
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al agregar producto al carrito",
      error: error.message
    });
  }
};

// Actualizar cantidad de producto en carrito
const actualizarProductoCarrito = async (req, res) => {
  try {
    const { usuarioId, productoId } = req.params;
    const { cantidad } = req.body;
    
    if (!cantidad || cantidad <= 0) {
      return res.status(400).json({
        message: "La cantidad debe ser mayor a 0"
      });
    }
    
    const carrito = await Carrito.findOne({ usuarioId });
    if (!carrito) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }
    
    const producto = carrito.productos.id(productoId);
    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado en el carrito" });
    }
    
    producto.cantidad = parseInt(cantidad);
    await carrito.save();
    
    return res.status(200).json({
      message: "Cantidad actualizada exitosamente",
      carrito: carrito
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar producto en carrito",
      error: error.message
    });
  }
};

// Eliminar producto del carrito
const eliminarProductoCarrito = async (req, res) => {
  try {
    const { usuarioId, productoId } = req.params;
    
    const carrito = await Carrito.findOne({ usuarioId });
    if (!carrito) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }
    
    carrito.productos.id(productoId).deleteOne();
    await carrito.save();
    
    return res.status(200).json({
      message: "Producto eliminado del carrito exitosamente",
      carrito: carrito
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al eliminar producto del carrito",
      error: error.message
    });
  }
};

// Vaciar carrito
const vaciarCarrito = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    
    const carrito = await Carrito.findOne({ usuarioId });
    if (!carrito) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }
    
    carrito.productos = [];
    await carrito.save();
    
    return res.status(200).json({
      message: "Carrito vaciado exitosamente",
      carrito: carrito
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al vaciar el carrito",
      error: error.message
    });
  }
};

module.exports = {
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
};