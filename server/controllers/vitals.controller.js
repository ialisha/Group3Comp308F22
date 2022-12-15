const { User, Vitals } = require("../models");

module.exports.recordVitals = async (vitals) => {
  const user = await User.findOne({
    firstName: vitals.firstName,
    lastName: vitals.lastName,
    role: "PATIENT",
  });
  if (user) {
    return new Vitals({
      bodyTemperature: vitals.bodyTemperature,
      heartRate: vitals.heartRate,
      bloodPressure: vitals.bloodPressure,
      respiratoryRate: vitals.respiratoryRate,
      patient: user._id,
      nurse: vitals.nurse,
    }).save();
  }
  return null;
};

module.exports.getVitals = async (id) => {
  return Vitals.findById(id);
};

module.exports.getPastVitals = async (firstName, lastName) => {
  const user = await User.findOne({
    firstName: firstName,
    lastName: lastName,
    role: "PATIENT",
  });
  if (!user) {
    return null;
  }
  return Vitals.find({ patient: user._id });
};
