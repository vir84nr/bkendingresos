const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// 🔓 middlewares
app.use(cors());
app.use(express.json());

// 🔗 conexión Mongo
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🟢 Mongo conectado"))
  .catch(err => console.log("🔴 Error Mongo:", err));

// 📦 modelo
const ingresoSchema = new mongoose.Schema({
  usuario: String,
  fecha: String,
  edificio: String,
  gerencia: String,
  puesto: String,
  equipo: String
}, { timestamps: true });

const Ingreso = mongoose.model("Ingreso", ingresoSchema);


// =========================
// 🚀 RUTAS
// =========================

// ✅ CREAR
app.post("/ingresos", async (req, res) => {
  try {
    const nuevo = new Ingreso(req.body);
    await nuevo.save();
    res.json({ ok: true, data: nuevo });
  } catch (error) {
    res.status(500).json({ error: "Error al guardar" });
  }
});

// ✅ OBTENER TODOS
app.get("/ingresos", async (req, res) => {
  try {
    const datos = await Ingreso.find().sort({ createdAt: -1 });
    res.json(datos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener datos" });
  }
});

// ✅ ELIMINAR
app.delete("/ingresos/:id", async (req, res) => {
  try {
    await Ingreso.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar" });
  }
});

// ✅ EDITAR
app.put("/ingresos/:id", async (req, res) => {
  try {
    const actualizado = await Ingreso.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar" });
  }
});


// =========================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});