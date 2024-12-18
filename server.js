const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());

app.use(express.static("public"));

mongoose
  .connect("mongodb://127.0.0.1:27017/testt2025", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie."))
  .catch((err) => console.error("Erreur de connexion à MongoDB:", err));

const HotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fabricationDate: { type: Date, required: true },
  nbrRooms: { type: Number, required: true },
});

const Hotel = mongoose.model("Hotel", HotelSchema);

app.post("/Hotel", async (req, res) => {
  const { name, fabricationDate, nbrRooms } = req.body;

  try {
    const nouveauHotel = new Hotel({
      name,
      fabricationDate,
      nbrRooms,
    });

    const HotelSauvegarde = await nouveauHotel.save();
    res.status(201).json(HotelSauvegarde);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: "Données invalides", details: err.errors });
    }
    res.status(500).json({ error: "Erreur interne du serveur", details: err });
  }
});

app.get("/Hotels", async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.status(200).json(hotels);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des hôtels", details: err });
  }
});

app.get("/Hotels/filter", async (req, res) => {
    try {
      const hotels = await Hotel.find({
        nbrRooms: { $gte: 10, $lte: 100 }, 
      });
      res.status(200).json(hotels);
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de la récupération des hôtels", details: err });
    }
  });
  

app.delete("/Hotel/:id", async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) {
      return res.status(404).json({ error: "Hôtel non trouvé" });
    }
    res.status(200).json({ message: "Hôtel supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la suppression de l'hôtel", details: err });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
