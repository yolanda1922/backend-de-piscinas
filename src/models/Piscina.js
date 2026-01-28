// 1. importaciones
const mongoose = require("mongoose");

// 2. schema
const piscinaSchema = mongoose.Schema(
  {
    idpiscina: {
      type: String,
      required: true,
    },
    PriceID: {  
      type: String,
      required: true
    },
    currency: {
      type: String,
      required: true
    },
    nombre: {
      type: String,
      required: true,
    },

      descripcion: {
      type: String,
      required: true,
    },
    ubicacion: {
      type: String,
      required: true,
    },
    precio: {
      type: Number,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    // Permite agregar la fecha en el que fue generado el documento.
    timestamps: true,
  },
);

// 3. modelo
const Piscina = mongoose.model("Piscina", piscinaSchema);

// 4. exportación
module.exports = Piscina;
