const mongoose = require("mongoose");

/**
 * @typedef {WithoutGraphQL<import("../graphql/resolvers.gen").Message>} GraphQLMessage
 */

// /**
//  * Any additional data that exists in the database
//  * @typedef {object} AdditionalData
//  */

/**
 * Structure of the data of the message
 * @typedef {GraphQLMessage} MessageData
 */

/**
 * Mongoose document of a message
 * @typedef {mongoose.HydratedDocument<MessageData>} MessageDoc
 */

/**
 * Mongoose schema of a message
 * @type {mongoose.Schema<MessageData>}
 */
const messageSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true,
    unique: false,
  },
});

// Just to help out GraphQL, but not necessary
messageSchema.virtual("__typename").get(() => "Message");

/**
 * Mongoose model of a registered user
 */
const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
