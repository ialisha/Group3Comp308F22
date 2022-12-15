const controllers = require("../controllers");

module.exports.resolvers = {
  Query: {
    getDailyInfo: async (_root, _args) => controllers.dailyINFO.getDailyInfo(_args.user)
  },

  Mutation: {
    dailyINFOrm: async (_root, _args) =>
      controllers.dailyINFO.dailyINFOrm(_args.generalInfo),
  },
};