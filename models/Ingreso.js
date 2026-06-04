const mongoose = require("mongoose");

const IngresoSchema = new mongoose.Schema({
  usuario: String,
  fecha: String,
  edificio: String,
  gerencia: String,
  puesto: String,
  equipo: String
});

module.exports = mongoose.model("Ingreso", IngresoSchema);