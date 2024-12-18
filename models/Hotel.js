const mongoose = require("mongoose");

const HotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fabricationDate: { type: Date, required: true },
  nbrRooms: { type: Number, required: true, default: 10 }, // Définition de la valeur par défaut
});

module.exports = mongoose.model("Hotel", HotelSchema);
