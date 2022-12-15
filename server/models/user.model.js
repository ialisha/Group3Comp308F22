const mongoose = require("mongoose");

/**
 * @typedef {WithoutGraphQL<import("../graphql/resolvers.gen").User>} GraphQLUser
 */

/**
 * Any additional data that exists in the database
 * @typedef {object} AdditionalUserData
 * @property {string} password - hashed password
 * @property {mongoose.Types.ObjectId} provider - healthcare provider of the patient
 */

/**
 * Structure of the data of a registered user
 * @typedef {GraphQLUser & AdditionalUserData} UserData
 */

/**
 * Mongoose document of a registered user
 * @typedef {mongoose.HydratedDocument<UserData>} UserDoc
 */

/**
 * Mongoose schema of a registered user
 * @type {mongoose.Schema<UserData>}
 */
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    transform: () => "********",
  },
  role: {
    type: String,
    enum: ["NURSE", "PATIENT"],
    default: "PATIENT",
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: 1,
  },
});

// Just to help out GraphQL, but not necessary
userSchema.virtual("__typename").get(() => "User");

/**
 * Mongoose model of a registered user
 */
const User = mongoose.model("User", userSchema);

module.exports = User;
