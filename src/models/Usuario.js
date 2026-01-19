// 1. importaciones
const mongoose = require("mongoose");

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