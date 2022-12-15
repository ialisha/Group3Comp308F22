const { makePrediction } = require("../advisor");

/** @type {import("./resolvers.gen").Resolvers} */
module.exports.resolvers = {
  Query: {
    healthAdvice: async (_root, args) => {
      const heartDiseaseProbability = await makePrediction(args.data);
      return {
        __typename: "PredictionResults",
        heartDiseaseProbability,
      };
    },
  },
};
