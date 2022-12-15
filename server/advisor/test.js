const tf = require("@tensorflow/tfjs-node");
const { readData, toInput, MODEL_FILE_URL } = require("./base");

async function testModel() {
  const data = await readData("test.csv");
  const input = toInput(data);
  console.log("Test data loaded");

  const model = await tf.loadLayersModel(MODEL_FILE_URL);
  console.log("Model loaded");

  const results = /** @type {tf.Tensor} */ (model.predict(input));
  const resultsArray = /** @type {[number, number][]} */ (
    await results.array()
  );
  console.log("Prediction finished");
  console.log("Actual / Predicted");

  for (let i = 0; i < resultsArray.length; i++) {
    console.log(`     ${data[i].target} / ${resultsArray[i][0]}`);
  }
}
testModel();
