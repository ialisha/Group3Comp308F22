const controllers = require("../controllers");

/**
 * @type {import("./resolvers.gen").Resolvers}
 */
module.exports.resolvers = {
  Query: {
    whoAmI: (_root, _args, context) => context.user,
  },

  Mutation: {
    register: (_root, args) => controllers.auth.register(args.accountData),
    signIn: (_root, args) =>
      controllers.auth.authenticate(args.email, args.password),
  },
};
