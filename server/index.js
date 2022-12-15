const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const { isProduction, db, port, paths } = require("./config");
const { parseUserMiddleware } = require("./controllers/auth.controller");
const { graphQLServer } = require("./graphql");

// Start to establish database connection
mongoose.connect(db, (error) => {
  if (error) {
    console.error("Failed to connect to mongodb");
    console.error(error);
  } else {
    console.log("Connection to mongodb established");
  }
});

// Set up the Express instance
const app = express();

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

// Log requests and server process time
app.use(morgan(isProduction ? "tiny" : "dev"));

// Compress large responses if running in production mode
if (isProduction) {
  app.use(require("compression")());
}

// Static files: fingerprinted files built from the client code
app.use(
  "/static",
  express.static(paths.clientBuildStatic, {
    immutable: isProduction,
    maxAge: isProduction ? "1y" : 0,
  })
);

// Static files: copied from the public folder
app.use("/", express.static(paths.clientBuild));

// Request body parsers
app.use(express.json(), express.urlencoded({ extended: true }));

// Authentication check
app.use(parseUserMiddleware);

// Register request handler for GraphQL requests
app.use("/graphql", graphQLServer);

// Catch-all routes to send the index.html
app.get("*", (req, res, next) => {
  if (req.accepts("html")) {
    res.sendFile(paths.indexFile);
  } else {
    next();
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
