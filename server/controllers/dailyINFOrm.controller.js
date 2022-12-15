const { User, DailyINFO } = require("../models");

module.exports.dailyINFOrm = async (dailyINFO) => {
  console.log(dailyINFO);
  const user = await User.findOne({
    _id: dailyINFO.patient,
  });
  console.log(user);
  if (user) {
    return new DailyINFO({
      pulseRate: dailyINFO.pulseRate,
      bloodPressure: dailyINFO.bloodPressure,
      weight: dailyINFO.weight,
      temperature: dailyINFO.temperature,
      patient: user._id,
      respiratoryRate: dailyINFO.respiratoryRate,
    }).save();
  }
  return null;
};

module.exports.getDailyInfo = async (id) => {
  return DailyINFO.findById(id);
};
