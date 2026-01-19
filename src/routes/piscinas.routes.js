const express = require("express");
const {
  getAllPiscinas,
  getPiscinaById,
  createPiscinas,
  updatePiscinas,
  deletePiscinas
} = require("../controllers/piscinas.controllers");

const piscinasRoutes = express.Router();

piscinasRoutes.get("/", getAllPiscinas); //localhost:8000/piscinas
piscinasRoutes.post("/", createPiscinas); //localhost:8000/piscinas
piscinasRoutes.get("/:id", getPiscinaById); //localhost:8000/piscinas/:id
piscinasRoutes.put("/:id", updatePiscinas); //localhost:8000/piscinas/:id
piscinasRoutes.delete("/:id", deletePiscinas); //localhost:8000/piscinas/:id

module.exports = piscinasRoutes;


