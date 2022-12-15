const path = require("path");

/**
 * Absolute directory path to this project
 */
const project = path.resolve(__dirname, "..", "..");

/**
 * Path to `.env` file at the project root (`<project>/.env`)
 *
 * This is only useful in the development (and maybe test) environment.
 */
const envFile = path.join(project, ".env");

/**
 * Path to the directory for the server code (`<project>/server/`)
 */
const server = path.join(project, "server");

/**
 * Path to the directory for the client code (`<project>/client/`)
 */
const client = path.join(project, "client");

/**
 * Path to the directory for the client-side built assets
 * (`<project>/client/build/`)
 */
const clientBuild = path.join(client, "build");

/**
 * Path to the `index.html` file to serve (`<project>/client/build/index.html`)
 */
const indexFile = path.join(clientBuild, "index.html");

/**
 * Path to the directory for client-side built static assets
 * (`<project>/client/build/static/`)
 *
 * The word "static" here means that the files inside that directory will not
 * change and are static. It might sound weird at first because this directory
 * is where all CSS and Javascript files built from our code goes into. But the
 * files themselves are static because for a different version of our code, the
 * build system creates a different file with a different name. Thus, one file
 * with a specific filename stays static all the time.
 */
const clientBuildStatic = path.join(clientBuild, "static");

/**
 * Path to the directory for defining GraphQL schema definitions
 * (`<project>/server/graphql/`)
 */
const serverGraphQL = path.join(server, "graphql");

/**
 * Path to the consolidated GraphQL schema file
 * (`<project>/server/graphql/schema.gen.graphql`)
 */
const schema = path.join(serverGraphQL, "schema.gen.graphql");

module.exports = {
  project,
  envFile,
  server,
  client,
  clientBuild,
  indexFile,
  clientBuildStatic,
  serverGraphQL,
  schema,
};
