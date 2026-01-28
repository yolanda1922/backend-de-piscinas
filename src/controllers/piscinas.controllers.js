const Piscina = require("../models/Piscina");
const stripe = require("stripe")(process.env.STRIPE_API_KEY);

// Obtener todas las piscinas
const getAllPiscinas = async (req, res) => {
  try {
    const piscinas = await Piscina.find();
    return res.status(200).json({
      message: "Piscinas obtenidas exitosamente",
      piscinas: piscinas,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener las piscinas", error: error.message });
  }
};

// Obtener una piscina por id
const getPiscinaById = async (req, res) => {
  try {
    const { id } = req.params;
    const piscina = await Piscina.findById(id);
    if (!piscina) {
      return res.status(404).json({ message: "Piscina no encontrada" });
    }
    return res.status(200).json({
      message: "Piscina obtenida exitosamente",
      piscina: piscina,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener la piscina", error: error.message });
  }
};

// Crear una nueva piscina
const createPiscinas = async (req, res) => {
  try {
    const { nombre, descripcion, ubicacion, precio, img, slug, currency } =
      req.body;

    // Validar que todos los campos requeridos estén presentes
    if (!nombre || !descripcion || !ubicacion || !precio) {
      return res.status(400).json({
        message:
          "Todos los campos son obligatorios: nombre, descripcion, ubicacion, precio",
      });
    }

    // Validar que el precio sea un número positivo
    if (isNaN(precio) || precio <= 0) {
      return res.status(400).json({
        message: "El precio debe ser un número positivo",
      });
    }

    // Generar slug si no se proporciona
    const piscinaSlug = slug || nombre.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Eliminar caracteres especiales
      .replace(/\s+/g, '-') // Reemplazar espacios por guiones
      .trim();

    // Crear producto en Stripe
    const stripeProduct = await stripe.products.create({
      name: nombre,
      description: descripcion,
      metadata: {
        slug: piscinaSlug,
        ubicacion: ubicacion
      },
    });

    // Crear precio en Stripe (convertir precio a centavos)
    const stripePrice = await stripe.prices.create({
      unit_amount: Math.round(precio * 100), // Convertir a centavos
      currency: currency || "clp",
      product: stripeProduct.id,
    });

    const newPiscina = await Piscina.create({
      idpiscina: stripeProduct.id,
      PriceID: stripePrice.id,
      currency: currency || "clp",
      nombre,
      descripcion,
      ubicacion,
      precio: Number(precio),
      img: img && img.length > 0 ? img[img.length - 1] : '',
      slug: piscinaSlug,
    });
 
    return res.status(201).json({
      message: "Piscina creada exitosamente",
      piscina: newPiscina,
      datosRecibidos: {
        nombre,
        descripcion,
        ubicacion,
        precio,
        img,
        slug: piscinaSlug,
        currency
      }
    });
  } catch (error) {
    console.log("Error al crear piscina:", error);
    return res
      .status(500)
      .json({ message: "Error al crear la piscina", error: error.message });
  }
};

// Actualizar una piscina existente
const updatePiscinas = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, ubicacion, precio } = req.body;

    const piscinaActualizada = await Piscina.findByIdAndUpdate(
      id,
      { nombre, descripcion, ubicacion, precio },
      { new: true },
    );

    if (!piscinaActualizada) {
      return res.status(404).json({ message: "Piscina no encontrada" });
    }

    return res.status(200).json({
      message: "Piscina actualizada exitosamente",
      piscina: piscinaActualizada,
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Error al actualizar la piscina",
        error: error.message,
      });
  }
};

// Eliminar una piscina
const deletePiscinas = async (req, res) => {
  try {
    const { id } = req.params;
    const piscinaEliminada = await Piscina.findByIdAndDelete(id);

    if (!piscinaEliminada) {
      return res.status(404).json({ message: "Piscina no encontrada" });
    }

    return res.status(200).json({
      message: "Piscina eliminada correctamente",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al eliminar la piscina", error: error.message });
  }
};

module.exports = {
  getAllPiscinas,
  getPiscinaById,
  createPiscinas,
  updatePiscinas,
  deletePiscinas,
};
