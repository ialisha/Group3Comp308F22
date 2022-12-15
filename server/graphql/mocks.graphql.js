/**
 * Temporary mock resolvers for mock schema
 * @type {import("./resolvers.gen").Resolvers}
 */
module.exports.resolvers = {
  Mutation: {
    mockDailyINFOrm: (_root, args) => ({ token: args.temperature }),
  },
};
