const mongoose = require("mongoose");

/** @typedef {WithoutGraphQL<import("../graphql/resolvers.gen").Alert>} GraphQLAlert */

/**
 * @typedef {object} AdditionalAlertData
 * @property {mongoose.Types.ObjectId} sender
 */

/** @typedef {GraphQLAlert & AdditionalAlertData} AlertData */

/** @typedef {mongoose.HydratedDocument<AlertData>} AlertDoc */

/** @type {mongoose.Schema<AlertData>} */
const alertSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    reason: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

// Just to help out GraphQL, but not necessary
alertSchema.virtual("__typename").get(() => "Alert");

const Alert = mongoose.model("Alert", alertSchema);
module.exports = Alert;
