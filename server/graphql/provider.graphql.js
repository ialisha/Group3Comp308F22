const controllers = require("../controllers");

/** @type {import("./resolvers.gen").Resolvers} */
module.exports.resolvers = {
  User: {
    // This is necessary because we do not want to return raw `ObjectId`
    provider: async (user, _args, context) =>
      controllers.user.getProvider(user, context),
  },

  Query: {
    myPatients: async (_root, _args, context) =>
      controllers.user.myPatients(context),
  },
};
