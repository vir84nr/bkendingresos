const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// =========================
// 🔓 MIDDLEWARES
// =========================
// Permitimos que tu Front en Netlify y tu desarrollo local se conecten al Back
const allowedOrigins = [
  "http://localhost:5500", // Por si probás con Live Server local
  "http://127.0.0.1:5500",
  "https://tu-app-de-netlify.netlify.app" // 👈 REEMPLAZÁ ESTO con la URL real de tu Netlify
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir peticiones sin origen (como herramientas de Postman o el mismo backend)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'El control CORS de esta API no permite acceso desde el origen especificado.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.use(express.json());

// =========================
// 🔗 CONEXIÓN MONGO
// =========================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🟢 Mongo conectado correctamente"))
  .catch(err => console.log("🔴 Error Mongo:", err));

// =========================
// 📦 MODELO
// =========================
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
// 🚀 RUTAS API
// =========================

// Ruta base de cortesía para verificar que el backend esté vivo en la nube
app.get("/", (req, res) => {
  res.send("🚀 API de Ingresos PNET corriendo perfectamente.");
});

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

// ✅ EDITAR (PUT)
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
// 🚀 SERVIDOR
// =========================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});