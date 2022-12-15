const { loadFilesSync } = require("@graphql-tools/load-files");
const { mergeResolvers, mergeTypeDefs } = require("@graphql-tools/merge");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { graphqlHTTP } = require("express-graphql");
const path = require("path");
const { paths, isProduction } = require("../config");

// Merge the schema definitions
const typeDefs = mergeTypeDefs(
  loadFilesSync(path.join(paths.serverGraphQL, "*.graphql"))
);

// Merge the resolvers
const resolvers = mergeResolvers(
  // @ts-ignore Erros out for some reason
  loadFilesSync(path.join(paths.serverGraphQL, "*.graphql.js"))
);

// Create a schema with execution information
const schema = makeExecutableSchema({ typeDefs, resolvers });

/**
 * Express middleware for handling a GraphQL request
 */
const graphQLServer = graphqlHTTP((request, response, graphQLParams) => ({
  schema,
  context: request,
  graphiql: !isProduction,
}));

module.exports = {
  typeDefs,
  resolvers,
  schema,
  graphQLServer,
};
