const controllers = require("../controllers");
const Message = require("../models/message.model");

/**
 * @type {import("./resolvers.gen").Resolvers}
 */
module.exports.resolvers = {
  Mutation: {
    sendMessage: (_root, args) => {
      return new Message({ body: args.body }).save();
    },
  },
  Query: {
    getMessages: async (_root, _args) => {
      return Message.find();
    },
  },
};
