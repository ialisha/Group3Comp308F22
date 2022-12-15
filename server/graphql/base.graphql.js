const { DateTimeScalar } = require("graphql-date-scalars");

/** @type {import("./resolvers.gen").Resolvers} */
module.exports.resolvers = {
  DateTime: DateTimeScalar,
};
