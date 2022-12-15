const tf = require("@tensorflow/tfjs-node");
const { MODEL_FILE_URL, toInput } = require("./base");

/**
 * @param {import("../graphql/resolvers.gen").PredictionData} data
 * @returns {Promise<number>}
 */
module.exports.makePrediction = async (data) => {
  const model = await tf.loadLayersModel(MODEL_FILE_URL);
  const input = toInput([module.exports.entryToRaw(data)]);
  const results = /** @type {tf.Tensor} */ (model.predict(input));
  const resultsData = await results.data();
  return resultsData[0];
};

const dataFieldSexMap = {
  M: /** @type {const} */ (0),
  F: /** @type {const} */ (1),
  [0]: "M",
  [1]: "F",
};

const dataFieldBooleanMap = {
  [0]: /** @type {const} */ (false),
  [1]: /** @type {const} */ (true),
};

const dataFieldLevelMap = {
  No: /** @type {const} */ (0),
  Some: /** @type {const} */ (1),
  Yes: /** @type {const} */ (2),
  Severe: /** @type {const} */ (3),
  [0]: /** @type {const} */ ("No"),
  [1]: /** @type {const} */ ("Some"),
  [2]: /** @type {const} */ ("Yes"),
  [3]: /** @type {const} */ ("Severe"),
};

/**
 * @param {import("../graphql/resolvers.gen").PredictionData} data
 * @return {import("./data").RawDataEntry}
 */
module.exports.entryToRaw = (data) => ({
  age: data.age,
  sex: dataFieldSexMap[data.sex],
  chestPain: dataFieldBooleanMap[data.chestPain],
  exerciseAngina: dataFieldBooleanMap[data.exerciseAngina],
  fastingBloodSugar: dataFieldBooleanMap[data.fastingBloodSugar],
  cholesterol: data.cholesterol,
  maxHeartRate: data.maxHeartRate,
  restingBloodPressure: data.restingBloodPressure,
});
