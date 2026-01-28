const express = require("express");

const app = express();
const port = 3004;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Servidor de prueba funcionando" });
});

app.post("/test", (req, res) => {
  console.log("Recibido POST:", req.body);
  res.json({ 
    message: "POST funciona correctamente", 
    received: req.body 
  });
});

app.listen(port, () => {
  console.log(`Test server running on port ${port}`);
});