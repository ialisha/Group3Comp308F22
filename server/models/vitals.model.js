const mongoose = require("mongoose");

const vitalSignsSchema = new mongoose.Schema({
  bodyTemperature: {
    type: Number,
  },
  heartRate: {
    type: Number,
  },
  bloodPressure: {
    type: Number,
  },
  respiratoryRate: {
    type: Number,
  },
  nurse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  recorded: {
    type: Date,
    default: Date.now,
  },
});

const Visit = mongoose.model("Vitals", vitalSignsSchema);
module.exports = Visit;
