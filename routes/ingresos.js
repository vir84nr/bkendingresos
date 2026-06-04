const express = require("express");
const router = express.Router();
const Ingreso = require("../models/Ingreso");


// 👉 GUARDAR
router.post("/", async (req, res) => {
  try {
    const nuevo = new Ingreso(req.body);
    await nuevo.save();
    res.json(nuevo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 👉 OBTENER TODOS
router.get("/", async (req, res) => {
  try {
    const datos = await Ingreso.find();
    res.json(datos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 👉 ELIMINAR
router.delete("/:id", async (req, res) => {
  try {
    await Ingreso.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;