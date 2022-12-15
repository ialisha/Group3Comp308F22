const mongoose = require("mongoose");

const dailyINFOSchema = new mongoose.Schema({
    pulseRate: {
    type: String,
  },
  bloodPressure: {
    type: String,
  },
  weight: {
    type: String,
  },
  respiratoryRate: {
    type: String,
  },
  temperature: {
    type: String,
  },
  nurse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Visit = mongoose.model("dailyINFO", dailyINFOSchema);
module.exports = Visit;
