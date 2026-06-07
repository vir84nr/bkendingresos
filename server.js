const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Intentar cargar dotenv solo si existe localmente (evita que explote en Render)
try {
  require("dotenv").config();
} catch (e) {
  console.log("Variables de entorno cargadas desde el proveedor de Hosting");
}

const app = express();

// =========================
// 🔓 CONFIGURACIÓN DE CORS
// =========================
const allowedOrigins = [
  "https://ingresospnet.netlify.app",
  "http://localhost:5500",
  "http://127.0.0.1:5500"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    let cleanOrigin = origin.toLowerCase().trim();
    if (cleanOrigin.endsWith('/')) {
      cleanOrigin = cleanOrigin.slice(0, -1);
    }

    const cleanAllowed = allowedOrigins.map(url => {
      let u = url.toLowerCase().trim();
      return u.endsWith('/') ? u.slice(0, -1) : u;
    });

    if (cleanAllowed.includes(cleanOrigin)) {
      return callback(null, true);
    } else {
      const msg = `El control CORS de esta API no permite acceso desde el origen especificado: ${origin}`;
      return callback(new Error(msg), false);
    }
  },
  credentials: true,
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization"
}));

// ========================================================
// 📦 MIDDLEWARE DE LECTURA DE JSON (¡ESTA LÍNEA FALTABA!)
// ========================================================
app.use(express.json());

// =========================
// 🔗 CONEXIÓN MONGO
// =========================
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("🔴 ERROR CRÍTICO: La variable MONGO_URI no está definida.");
  process.exit(1);
}

mongoose.connect(MONGO_URI)
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

// Ruta raíz para verificar estado
app.get("/", (req, res) => {
  res.send("🚀 API de Ingresos PNET corriendo perfectamente en la nube.");
});

// ✅ OBTENER TODOS (GET)
app.get("/ingresos", async (req, res) => {
  try {
    const datos = await Ingreso.find().sort({ createdAt: -1 });
    res.json(datos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener datos" });
  }
});

// ✅ CREAR (POST)
app.post("/ingresos", async (req, res) => {
  try {
    const nuevo = new Ingreso(req.body);
    await nuevo.save();
    res.json({ ok: true, data: nuevo });
  } catch (error) {
    res.status(500).json({ error: "Error al guardar" });
  }
});

// ✅ ELIMINAR (DELETE)
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