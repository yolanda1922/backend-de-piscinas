// 1. importaciones
const mongoose = require("mongoose");
const Carrito = require("./carrito");
const piscinasRoutes = require("../routes/piscinas.routes");

// 2. schema
const usuarioSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      unique: true,
      minlength: 6
    },
    CarritoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Carrito",
      default: []     //arreglo vacio
    },
    pais: {
      type: String,
      default: []
    },
    direccion: {
      type: String,
      default: []
    },
    telefono: {
      type: String,
      default: []
    }, 
    zipcode: {
      type: Number,
      default: 0
      
    } 

  },
  {
    // Permite agregar la fecha en el que fue generado el documento.
    timestamps: true,
  }
);

// 3. modelo
const Usuario = mongoose.model("Usuario", usuarioSchema);

// 4. exportación
module.exports = Usuario;