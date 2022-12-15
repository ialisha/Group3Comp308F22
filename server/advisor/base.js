const tf = require("@tensorflow/tfjs-node");
const fs = require("fs/promises");
const path = require("path");

const DELIMITER = ",";
const ENTRY_FIELD_NUM = 8;

const MODEL_DIR = path.join(__dirname, "model");
const MODEL_FILE = path.join(MODEL_DIR, "model.json");

module.exports.MODEL_DIR_URL = `file://${MODEL_DIR}`;
module.exports.MODEL_FILE_URL = `file://${MODEL_FILE}`;

/** @typedef {import("./data").TrainingDataEntry[]} TrainingDataSet */

/**
 * @param {string} filename
 * @returns {Promise<TrainingDataSet>}
 */
module.exports.readData = async (filename) => {
  const file = await fs.readFile(path.join(__dirname, "data", filename));

  /** @type {TrainingDataSet} */
  const data = require("csv-parse/sync").parse(file, {
    delimiter: DELIMITER,
    columns: true,
  });

  return data;
};

/**
 * @param {import("./data").RawDataEntry[]} data
 * @returns {tf.Tensor2D}
 */
module.exports.toInput = (data) => {
  return tf.tensor2d(
    data.map((entry) => [
      entry.age,
      entry.sex,
      entry.chestPain,
      entry.exerciseAngina,
      entry.fastingBloodSugar,
      entry.cholesterol,
      entry.maxHeartRate,
      entry.restingBloodPressure,
    ]),
    [data.length, ENTRY_FIELD_NUM],
    "int32"
  );
};

/**
 * @param {TrainingDataSet} data
 * @returns {tf.Tensor2D}
 */
module.exports.toOutput = (data) => {
  return tf.tensor2d(
    data.map(({ target }) => [target, 1 - target]),
    [data.length, 2],
    "int32"
  );
};
