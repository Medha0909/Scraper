const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());

const MONGO_URI = "mongodb+srv://medhadwivedi2003:pNFURpL2vPLQLvlJ@cluster0.7gbfuyy.mongodb.net/eventsdb";
mongoose.connect(MONGO_URI);

const eventSchema = new mongoose.Schema({
  area: String,
  title: String,
  desc: String,
  startDate: String,
  endDate: String,
  rate: String,
});

const Event = mongoose.model("Event", eventSchema);

app.get("/api/events", async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
