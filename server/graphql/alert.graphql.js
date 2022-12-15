const { Alert, User } = require("../models");

/** @type {import("./resolvers.gen").Resolvers} */
module.exports.resolvers = {
  Alert: {
    sender: async (alert) => {
      const sender = await User.findById(alert.sender);
      return /** @type {import("../models/user.model").UserDoc} */ (sender);
    },
  },
  Query: {
    getAlerts: async () => Alert.find().sort({ createdAt: -1 }),
  },
  Mutation: {
    sendAlert: async (_root, args, context) => {
      if (!context.user) return null;
      return new Alert({
        sender: context.user._id,
        reason: args.reason,
      }).save();
    },
  },
};
