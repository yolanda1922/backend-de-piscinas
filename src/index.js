require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const port = process.env.PORT || 5000;
const piscinasRoutes = require("./routes/piscinas.routes");
const usuariosRoutes = require("./routes/usuarios.routes");

const app = express();
connectDB();

// Middleware
app.use(cors()); // Habilitar CORS
app.use(express.json()); // Middleware para parsear JSON

// Rutas
app.use("/piscinas", piscinasRoutes);
app.use("/usuarios", usuariosRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  return res
    .status(200)
    .json({ message: "API de Piscinas funcionando correctamente!", status: true });
});

app
  .listen(port, "0.0.0.0", () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Access the server at: http://localhost:${port}`);
  })
  .on("error", (err) => {
    console.error("Error starting server:", err);
  });