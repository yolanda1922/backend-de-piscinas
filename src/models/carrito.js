const { default: mongoose } = require("mongoose")

const carritoSchema = mongoose.Schema(
  {
    productos: [    
        {
            nombreProducto: {
                type: String,
                required: true
            },
            precioProducto: {
                type: Number,
                required: true
            },
            cantidad: {
                type: Number,
                required: true,
                default: 1
            },
            Imagen: {
                type: String,
                required: false
            },
            slug: {
                type: String
            }
        }
    ],
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario", 
        required: true
    }
  },
    {
    // Permite agregar la fecha en el que fue generado el documento.
    timestamps: true,
  }
);
const Carrito = mongoose.model("Carrito", carritoSchema);

module.exports = Carrito;
