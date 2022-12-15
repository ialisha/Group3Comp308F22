const tf = require("@tensorflow/tfjs-node");
const { readData, toInput, toOutput, MODEL_DIR_URL } = require("./base");

const EPOCHS = 1000;

async function train() {
  const data = await readData("data.csv");
  const input = toInput(data);
  const output = toOutput(data);

  const model = getModel();
  const info = await model.fit(input, output, {
    epochs: EPOCHS,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(`Epoch #${epoch}: ${logs?.acc} ${logs?.loss}`);
      },
    },
  });
  console.log(`Train finished`);

  await model.save(MODEL_DIR_URL);
}
train();

/**
 * @returns {tf.LayersModel}
 */
function getModel() {
  const model = tf.sequential({
    name: "heart-disease",
    layers: [
      tf.layers.dense({
        inputShape: [8],
        units: 12,
        activation: "sigmoid",
      }),
      tf.layers.dense({
        units: 2,
        activation: "softmax",
      }),
    ],
  });
  model.compile({
    loss: "categoricalCrossentropy",
    optimizer: "adam",
    metrics: ["accuracy"],
  });
  model.summary();
  return model;
}
