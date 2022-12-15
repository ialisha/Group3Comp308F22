const controllers = require("../controllers");

module.exports.resolvers = {
  Query: {
    getVitals: async (_root, _args) => controllers.vitals.getVitals(_args.user),
    getPastVitals: async (_root, _args) =>
      controllers.vitals.getPastVitals(_args.firstName, _args.lastName),
  },

  Mutation: {
    recordVitals: async (_root, _args) =>
      controllers.vitals.recordVitals(_args.vitalsData),
  },
};
