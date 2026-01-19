const Piscina = require("../models/Piscina");

// Obtener todas las piscinas
const getAllPiscinas = async (req, res) => {
  try {
    const piscinas = await Piscina.find(); 
    return res.status(200).json({
      message: "Piscinas obtenidas exitosamente",
      piscinas: piscinas
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
      piscina: piscina
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
    const { nombre, descripcion, ubicacion, precio } = req.body;
    
    // Validar que todos los campos requeridos estén presentes
    if (!nombre || !descripcion || !ubicacion || !precio) {
      return res.status(400).json({ 
        message: "Todos los campos son obligatorios: nombre, descripcion, ubicacion, precio" 
      });
    }
    
    // Validar que el precio sea un número positivo
    if (isNaN(precio) || precio <= 0) {
      return res.status(400).json({ 
        message: "El precio debe ser un número positivo" 
      });
    }
    
    const nuevaPiscina = new Piscina({
      nombre,
      descripcion,
      ubicacion,
      precio: Number(precio)
    });
    
    await nuevaPiscina.save();
    
    return res.status(201).json({
      message: "Piscina creada exitosamente",
      piscina: nuevaPiscina
    });
  } catch (error) {
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
      { new: true }
    );
    
    if (!piscinaActualizada) {
      return res.status(404).json({ message: "Piscina no encontrada" });
    }
    
    return res.status(200).json({
      message: "Piscina actualizada exitosamente",
      piscina: piscinaActualizada
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al actualizar la piscina", error: error.message });
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
      message: "Piscina eliminada correctamente" 
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
  deletePiscinas
};